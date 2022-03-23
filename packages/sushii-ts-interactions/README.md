# sushii-interactions

TypeScript + Discord.js

This will handle slash commands and interactions, running alongside existing
sushii-2 until feature parity is reached. Future development will be in TS as to
be able to develop features in a more timely matter.

## Handlers

Stateless interaction handlers.

custom IDs are unique per handler to determine which handler to send which 
request to. This is useful for things like buttons.

Button Name:Feature:Additional Data
