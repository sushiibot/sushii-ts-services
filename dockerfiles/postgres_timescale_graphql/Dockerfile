ARG TIMESCALE_VERSION=2.6.1-pg14

FROM timescale/timescaledb:${TIMESCALE_VERSION} as build

ARG PG_GRAPHQL_VERSION=v0.2.0
ARG LIB_GRAPHQL_PARSER_VERSION=v0.7.0

RUN apk update && apk add --no-cache bash git cmake clang build-base python2 postgresql-dev

RUN export \
    REPO_URL="https://github.com/graphql/libgraphqlparser" \
    && git clone -b "${LIB_GRAPHQL_PARSER_VERSION}" --depth 1 "${REPO_URL}" \
    && cd libgraphqlparser \
    && cmake . \
    && make install

RUN git clone -b "${PG_GRAPHQL_VERSION}" \
    --depth 1 \
    https://github.com/supabase/pg_graphql.git

WORKDIR /pg_graphql
RUN ./bin/pgc build
RUN make install

FROM timescale/timescaledb:${TIMESCALE_VERSION}

# libgraphqlparser
ENV LD_LIBRARY_PATH="/usr/local/lib:${LD_LIBRARY_PATH}"
COPY --from=build ["/usr/local/lib/libgraphqlparser.so", "/usr/local/lib/libgraphqlparser.so"]

# pg_graphql
COPY --from=build ["/usr/local/lib/postgresql", "/usr/local/lib/postgresql"]
COPY --from=build ["/usr/local/share/postgresql", "/usr/local/share/postgresql"]
