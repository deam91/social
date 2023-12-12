#!/bin/bash
set -e
cmd="$@"

until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -c '\q'; do
  >&2 echo "Database is loading - sleeping"
  sleep 3
done

>&2 echo "Database is up - running migrations"
npx ts-node ./node_modules/typeorm/cli.js migration:run -d data-source.ts

>&2 echo "Migrations complete - starting application"
npm run start:prod
