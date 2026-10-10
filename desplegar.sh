#!/bin/bash
# Publica RESTOBAR ERP en Google Cloud Run + Cloud SQL.
set -euo pipefail
cd "$(dirname "$0")"

REGION="${REGION:-us-central1}"
INSTANCE=restobar-db
DB=restobar
DB_USER=restobar
SERVICE=restobar

PROJECT_ID="$(gcloud config get-value project 2>/dev/null || true)"
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  echo "No hay proyecto activo. En Cloud Shell ejecuta: gcloud config set project TU_ID"
  exit 1
fi

echo "Proyecto: $PROJECT_ID"
echo "Región: $REGION"
echo "Activando servicios de Google. Puede tardar un minuto."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --quiet

DB_PASS="$(openssl rand -hex 16)"
AUTH_SECRET="$(openssl rand -hex 32)"

if ! gcloud sql instances describe "$INSTANCE" --format='value(name)' >/dev/null 2>&1; then
  echo "Creando la base de datos. Esto tarda unos 10 minutos. No cierres Cloud Shell."
  gcloud sql instances create "$INSTANCE" \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --region="$REGION" \
    --storage-size=10GB \
    --root-password="$DB_PASS" \
    --quiet
fi

gcloud sql databases create "$DB" --instance="$INSTANCE" --quiet 2>/dev/null || true
if ! gcloud sql users create "$DB_USER" --instance="$INSTANCE" --password="$DB_PASS" --quiet 2>/dev/null; then
  gcloud sql users set-password "$DB_USER" --instance="$INSTANCE" --password="$DB_PASS" --quiet
fi

CONN="$(gcloud sql instances describe "$INSTANCE" --format='value(connectionName)')"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/cloudsql.client" \
  --quiet >/dev/null

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@/${DB}?host=/cloudsql/${CONN}"

echo "Subiendo la aplicación. La primera vez tarda varios minutos."
gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --add-cloudsql-instances "$CONN" \
  --set-env-vars "DATABASE_URL=${DATABASE_URL},BETTER_AUTH_SECRET=${AUTH_SECRET}" \
  --quiet

URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"

gcloud run services update "$SERVICE" \
  --region "$REGION" \
  --update-env-vars "BETTER_AUTH_URL=${URL}" \
  --quiet

echo ""
echo "LISTO. Abre esta dirección:"
echo "$URL"
echo ""
echo "Guarda estos datos. No los compartas:"
echo "Clave de la base: $DB_PASS"
echo "Secreto de sesiones: $AUTH_SECRET"
