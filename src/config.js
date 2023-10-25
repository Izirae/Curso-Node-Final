import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_SECRET: process.env.MONGO_SECRET,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  ENVIRONMENT: process.env.ENVIRONMENT,
  MAIL_APP: process.env.MAIL_APP,
  MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD,
  JWT_PASSWORD_REQUEST: process.env.JWT_PASSWORD_REQUEST
}