# sushii-interactions

TypeScript + [Discord API Types](https://github.com/discordjs/discord-api-types)

This will handle slash commands and interactions, running alongside existing
sushii-2 until feature parity is reached. Future development will be in TS as to
be able to develop features in a more timely matter.

This does not actually use Discord.js, just the API types as Discord.js is not
designed to be used without the gateway and relies on cache for a lot of things.

## Handlers

Stateless interaction handlers.

custom IDs are unique per handler to determine which handler to send which 
request to. This is useful for things like buttons.

Button Name:Feature:Additional Data
