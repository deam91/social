#!/bin/bash
set -e
cmd="$@"

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -c '\q'; do
  >&2 echo "Database is loading - sleeping"
  sleep 3
done

>&2 echo "Database is up - running migrations"
npx ts-node ./node_modules/typeorm/cli.js migration:run -d data-source.ts

>&2 echo "Migrations complete - starting application"
npm run start:prod
