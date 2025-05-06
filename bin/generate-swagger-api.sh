#!/usr/bin/env bash

# Generate the API client using the Swagger Codegen CLI
npx openapi-typescript http://localhost:3000/swagger.json -o packages/frontend/src/network/swagger-api.ts

# # Run prettier to format the generated code
npx prettier --write packages/frontend/src/network/swagger-api.ts
