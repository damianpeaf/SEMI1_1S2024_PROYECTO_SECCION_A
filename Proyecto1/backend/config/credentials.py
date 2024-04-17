from decouple import config


# Cognito
COGNITO_REGION = config('COGNITO_REGION')
COGNITO_USER_POOL_ID = config('COGNITO_USER_POOL_ID')
COGNITO_CLIENT_ID = config('COGNITO_CLIENT_ID')
