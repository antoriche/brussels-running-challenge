
cd $(dirname "$0")

pulumi stack select

echo "Email: "
read email

echo "Temporary Password: "
password=$(openssl rand -base64 32)
echo $password

pool=$(pulumi stack output cognito_user_pool_id 2> /dev/null)

aws cognito-idp admin-create-user --user-pool-id "$pool" --username "$email" --temporary-password "$password" --user-attributes "Name=email,Value=$email" "Name=email_verified,Value=True" > /dev/null