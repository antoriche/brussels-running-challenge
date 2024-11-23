
cd $(dirname "$0")

pulumi stack select

pool=$(pulumi stack output cognito_user_pool_id 2> /dev/null)
client=$(pulumi stack output cognito_app_client_id 2> /dev/null)
region=$(pulumi stack output region 2> /dev/null)

echo "# .env variables for the App"
echo "REACT_APP_COGNITO_REGION="$region
echo "REACT_APP_COGNITO_USER_POOL_ID="$pool
echo "REACT_APP_COGNITO_APP_CLIENT_ID="$client