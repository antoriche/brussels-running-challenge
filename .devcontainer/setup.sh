#!/usr/bin/env sh

npm i

if [ ! -f api/.env ]; then
  cp api/.env.sample api/.env
fi

if [ ! -f app/.env ]; then
  cp app/.env.sample app/.env
fi
