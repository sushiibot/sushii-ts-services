FROM timescale/timescaledb:2.6.0-pg14

ENV PGBINOLD /usr/lib/postgresql/12/bin
ENV PGBINNEW /usr/lib/postgresql/14/bin

ENV PGDATAOLD /var/lib/postgresql/12/data
ENV PGDATANEW /var/lib/postgresql/14/data

RUN mkdir -p "$PGDATAOLD" "$PGDATANEW" \
    && chown -R postgres:postgres /var/lib/postgresql

WORKDIR /var/lib/postgresql

COPY docker-upgrade /usr/local/bin/

ENTRYPOINT ["docker-upgrade"]

# recommended: --link
CMD ["pg_upgrade"]