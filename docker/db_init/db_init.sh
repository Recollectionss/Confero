#!/bin/bash
echo "** Started creating default DB and users"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $APP_USER_NAME WITH PASSWORD '$APP_USER_PASSWORD';

    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, SELECT, UPDATE ON TABLES TO "$APP_USER_NAME";
EOSQL

echo "** Finished creating default DB and users"