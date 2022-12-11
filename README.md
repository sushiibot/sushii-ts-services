# sushii-ts-services

Microservices for sushii bot.

This uses [twilight-dispatch] to connect to the Discord gateway and dump events
into RabbitMQ. `sushii-worker` service then processes these events.

Discord Gateway -> RabbitMQ -> sushii-worker

For any persisted data, services can query and mutate via the graphql
`sushii-data` service. Sushii-worker does GraphQL queries and mutations over
a websocket connection due to the high request rate.

## Packages

* `sushii-data` - GraphQL API for any persisted data from PostgreSQL
* `sushii-worker` - Stateless interactions worker process

[twilight-dispatch]: https://github.com/chamburr/twilight-dispatch
