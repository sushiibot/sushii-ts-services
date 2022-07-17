# sushii-ts-services

Microservices for sushii bot.

This uses [twilight-dispatch] to connect to the Discord gateway and dump events
into RabbitMQ. `sushii-ts-interactions` service then processes these events.

Discord Gateway -> RabbitMQ -> sushii-ts-interactions

For any persisted data, services can query and mutate via the graphql
`sushii-data` service.

## Packages

* `sushii-data` - GraphQL API for any persisted data from PostgreSQL
* `sushii-ts-interactions` - Stateless interactions handler

[twilight-dispatch]: https://github.com/chamburr/twilight-dispatch
