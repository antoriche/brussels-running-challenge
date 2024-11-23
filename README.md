# Brussels Running Challenge

## Getting started

1. Clone this repo
2. Copy files env.sample into .env (in app and api folders) and fill with appropriates values
3. run `npm install` in root folder, app, api and shared

## Run the app

You'll need to run 3 terminals

1. You'll need to transpile typescript from shared resources : `cd shared ; npm run dev`
2. You'll need to run the api : `cd api ; npm start`
3. You'll need to run the app : `cd app ; npm start`

## Deploy the app

In `infra` folder, create and complete `Pulumi.<env>.yaml`  
Deploy it with `pulumi up --stack JetpackAI/<env>`
