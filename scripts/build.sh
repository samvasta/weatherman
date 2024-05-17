#!/bin/bash

cd app/frontend

pnpm i

pnpm build

cd ..

go mod tidy

go build