const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    WEB_FRONTEND_URL: Joi.string().required().description("The frontend url"),
    CLOUDINARY_CLOUD_NAME: Joi.string()
      .required()
      .description("Cloudinary Cloud Name"),
    CLOUDINARY_API_KEY: Joi.string()
      .required()
      .description("Cloudinary API Key"),
    CLOUDINARY_API_SECRET: Joi.string()
      .required()
      .description("Cloudinary API Secret"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  socket: {
    cors: {
      origin:
        envVars.NODE_ENV === "production" ? false : [envVars.WEB_FRONTEND_URL],
    },
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  },
};
