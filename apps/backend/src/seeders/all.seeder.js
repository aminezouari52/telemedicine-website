// Runs every seeder in dependency order: pnpm -F=backend seed:all
//
// Order matters: seed:doctor and seed:patient delete every doctor and patient,
// so the demo logins are restored after them, and consultations are seeded
// once all doctors and patients exist. Embeddings come last because they read
// the patients and consultations. Steps whose env vars are unset are skipped.
const { execFileSync } = require("child_process");
const path = require("path");
const config = require("../config/config");
const logger = require("../config/logger");

const hasDemo = Boolean(
  config.demo.doctorEmail && config.demo.patientEmail && config.demo.password,
);
const hasAdmin = Boolean(config.admin.email && config.admin.password);

const steps = [
  { script: "seed:doctor", file: "doctor.seeder.js" },
  { script: "seed:patient", file: "patient.seeder.js" },
  {
    script: "seed:logins",
    file: "loginAccounts.seeder.js",
    skip: !hasDemo && "DEMO_* not set",
  },
  {
    script: "seed:admin",
    file: "admin.seeder.js",
    skip: !hasAdmin && "ADMIN_EMAIL or ADMIN_PASSWORD not set",
  },
  { script: "seed:consultation", file: "consultation.seeder.js" },
  { script: "seed:embeddings", file: "embedding.seeder.js" },
];

for (const { script, file, skip } of steps) {
  if (skip) {
    logger.info(`Skipping ${script}: ${skip}`);
    continue;
  }
  logger.info(`Running ${script}`);
  try {
    execFileSync(process.execPath, [path.join(__dirname, file)], {
      stdio: "inherit",
    });
  } catch {
    logger.error(`${script} failed; later steps were not run.`);
    process.exit(1);
  }
}

logger.info("All seeders finished.");
