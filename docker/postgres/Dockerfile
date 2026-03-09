FROM postgres:16-alpine

# Copy SQL init scripts to a staging directory (not entrypoint-initdb.d to avoid auto-execution)
COPY NAuth/nauth.sql /tmp/nauth.sql
COPY NNews/nnews.sql /tmp/nnews.sql

# Copy shell init script that creates databases and runs the SQL scripts
COPY docker/postgres/init.sh /docker-entrypoint-initdb.d/01-init.sh
RUN chmod +x /docker-entrypoint-initdb.d/01-init.sh
