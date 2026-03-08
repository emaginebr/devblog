#!/bin/bash
set -e

# Create NAuth database and run its init script
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE nauth_db;
    CREATE DATABASE nnews_db;
EOSQL

# Initialize NAuth schema
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "nauth_db" -f /tmp/nauth.sql

# Initialize NNews schema
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "nnews_db" -f /tmp/nnews.sql
