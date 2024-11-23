# Jetpack react app boiler plate

**TODO :** maintain this `getting started` document

## Getting started a new project with this boilerplate

1. Clone this repo
2. Search for `boilerplate` occurences and replace with your project name. Use the same value everywhere and prefer pascal case
3. Copy files env.sample into .env (in app and api folders) and fill with appropriates values
4. run `npm install` in root folder, app, api and shared

## Run the app

You'll need to run 3 terminals

1. You'll need to transpile typescript from shared resources : `cd shared ; npm run dev`
2. You'll need to run the api : `cd api ; npm start`
3. You'll need to run the app : `cd app ; npm start`

## Deploy the app

In `infra` folder, create and complete `Pulumi.<env>.yaml`  
Deploy it with `pulumi up --stack JetpackAI/<env>`

### Setup the Github action CICD for Azure

1. Open the file .github/workflows/deploy-azure.yml and add triggers on branchs you want to deploy
2. [In the settings of the Github Repo (Environnements tab)](https://github.com/jetpackAI/react-app-boilerplate/settings/environments), create a new environnement with the name of the branch:

   - PULUMI_STACK_NAME : the name of the pulumi env (eg. JetpackAI/prd)
   - PULUMI_ACCESS_TOKEN (secret) : can be find at [app.pulumi.com](https://app.pulumi.com/) > User menu > Personal access tokens
   - AZURE_CREDENTIALS (secret) : [details](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure?tabs=azure-portal%2Clinux#code-try-0)  
      Can be generated with the following command

     ```
     # Might need to create a role if necessary
     # az ad app create --display-name "GitHub Connection"
     # az ad sp create --id <the id of the app just created>

     az ad sp create-for-rbac --name "GitHub Connection" --role contributor \
        --scopes /subscriptions/ccd99dc3-97f1-4658-9929-3df405387582 \
        --sdk-auth

     # use the JSON output as value for the variable
     ```
