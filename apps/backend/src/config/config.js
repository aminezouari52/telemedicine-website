const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(8000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    WEB_FRONTEND_URL: Joi.string().required().description("The frontend url"),
    // Optional services: leave a group unset to turn its feature off (see
    // `features` below). An empty value counts as unset.
    CLOUDINARY_CLOUD_NAME: Joi.string()
      .empty("")
      .description("Cloudinary Cloud Name"),
    CLOUDINARY_API_KEY: Joi.string()
      .empty("")
      .description("Cloudinary API Key"),
    CLOUDINARY_API_SECRET: Joi.string()
      .empty("")
      .description("Cloudinary API Secret"),
    LIVEKIT_API_KEY: Joi.string().empty("").description("LiveKit Api Key"),
    LIVEKIT_API_SECRET: Joi.string()
      .empty("")
      .description("LiveKit Api Secret"),
    STRIPE_SECRET_KEY: Joi.string().empty("").description("Stripe Secret Key"),
    STRIPE_WEBHOOK_SECRET: Joi.string()
      .empty("")
      .description("Stripe Webhook Secret"),
    GEMINI_API_KEY: Joi.string()
      .empty("")
      .description("Google Gemini API key (chat + embeddings)"),
    AI_MESSAGES_PER_HOUR: Joi.number()
      .integer()
      .min(1)
      .default(30)
      .description("AI assistant messages each user may send per hour"),
    CLERK_SECRET_KEY: Joi.string().required().description("Clerk Secret Key"),
    CLERK_JWT_KEY: Joi.string()
      .optional()
      .description("Clerk JWT public key (PEM) for networkless verification"),
    ADMIN_EMAIL: Joi.string()
      .email()
      .optional()
      .description("Admin login (seed:admin)"),
    ADMIN_PASSWORD: Joi.string()
      .optional()
      .description("Admin password (seed:admin)"),
    DEMO_DOCTOR_EMAIL: Joi.string()
      .email()
      .optional()
      .description("Demo doctor login (seed:logins)"),
    DEMO_PATIENT_EMAIL: Joi.string()
      .email()
      .optional()
      .description("Demo patient login (seed:logins, seed:patient)"),
    DEMO_PASSWORD: Joi.string()
      .optional()
      .description("Password for both demo logins (seed:logins)"),
  })
  // A half-configured service fails at startup instead of on first use.
  .and("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")
  .and("LIVEKIT_API_KEY", "LIVEKIT_API_SECRET")
  .and("STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET")
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
  webFrontendUrl: envVars.WEB_FRONTEND_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  },
  livekit: {
    api_key: envVars.LIVEKIT_API_KEY,
    api_secret: envVars.LIVEKIT_API_SECRET,
  },
  stripe: {
    secretKey: envVars.STRIPE_SECRET_KEY,
    webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
  },
  ai: {
    apiKey: envVars.GEMINI_API_KEY,
    messagesPerHour: envVars.AI_MESSAGES_PER_HOUR,
  },
  // Which optional services are configured. Served to the frontend by
  // GET /v1/features so it can hide what is turned off.
  features: {
    // Off: every consultation is booked for free.
    payments: Boolean(envVars.STRIPE_SECRET_KEY),
    // Off: consultation rooms (video and chat) can't be joined.
    video: Boolean(envVars.LIVEKIT_API_KEY),
    // Off: doctors can't upload a profile photo.
    uploads: Boolean(envVars.CLOUDINARY_CLOUD_NAME),
    // Off: no AI assistant and no embeddings for AI search.
    ai: Boolean(envVars.GEMINI_API_KEY),
  },
  clerk: {
    secretKey: envVars.CLERK_SECRET_KEY,
    jwtKey: envVars.CLERK_JWT_KEY,
    // Session tokens carry the origin that minted them (`azp`); rejecting other
    // origins stops tokens issued to a different app from being replayed here.
    authorizedParties: [envVars.WEB_FRONTEND_URL.replace(/\/+$/, "")],
  },
  // Only `seed:admin` reads these; it refuses to run without both.
  admin: {
    email: envVars.ADMIN_EMAIL,
    password: envVars.ADMIN_PASSWORD,
  },
  // Optional: only the demo seeders read these. Leave them unset to seed
  // purely random data with no fixed login accounts.
  demo: {
    doctorEmail: envVars.DEMO_DOCTOR_EMAIL,
    patientEmail: envVars.DEMO_PATIENT_EMAIL,
    password: envVars.DEMO_PASSWORD,
  },
};
