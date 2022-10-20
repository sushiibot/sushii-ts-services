# sushii-data

GraphQL api for sushii. Used by sushii processes and later on the frontend.

Authentication:
* User -> Ory Kratos -> Ory Oathkeeper -> JWT -> PostGraphile
* Service -> JWT -> PostGraphile

## JWK, JWTs, and Machine Tokens

A JWK is required for Ory OathKeeper to create signed JWTs to pass to PostGraphile.

sushii services also require JWT for authentication with PostGraphile. A JWT token
can be manually created with
[`jose-util`](https://github.com/go-jose/go-jose/tree/v3/jose-util) with the role
claim set to `sushii_admin`. Requests from sushii internal services do not have to go
through Ory Oathkeeper, as Oathkeeper is primarily just to add JWT tokens for
user flow for authentication and authorization. JWT is **not** used for
sessions.

```bash
# generate PEM format priv/pub key pair
ssh-keygen -t ecdsa -b 521 -m PEM

# Convert pubkey to PEM format
ssh-keygen -f ecdsa.pub -e -m pem > ecdsa.pub.pem

echo '{"role": "sushii_admin"}' | jose-util sign --alg ES512 --key ecdsa

# Use the PEM formatted pubkey to verify
echo 'ey...' | jose-util verify --key ecdsa.pub.pem
```

This generated key should be passed to sushii-data via the Authorization header:

`Authorization: Bearer <token>`

