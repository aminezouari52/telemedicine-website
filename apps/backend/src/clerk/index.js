const { createClerkClient } = require("@clerk/backend");
const config = require("../config/config");

const clerkClient = createClerkClient({ secretKey: config.clerk.secretKey });

// Clerk API errors carry the useful detail in `errors[0].longMessage`.
const clerkErrorMessage = (err) =>
  err?.errors?.[0]?.longMessage || err?.message || String(err);

/**
 * Creates the Clerk user for `email`, or resets its password if it already
 * exists, so seeded accounts always sign in with the password that was logged.
 * Clerk's password checks are deliberately kept: a breached password would be
 * accepted here with them skipped, but Clerk then forces a reset at sign-in,
 * so it's better to fail at seed time with Clerk's explanation.
 */
async function ensureClerkUser(email, password) {
  const { data: [existing] = [] } = await clerkClient.users.getUserList({
    emailAddress: [email],
  });

  if (existing) {
    await clerkClient.users.updateUser(existing.id, { password });
    return { user: existing, created: false };
  }

  const user = await clerkClient.users.createUser({
    emailAddress: [email],
    password,
  });
  return { user, created: true };
}

module.exports = { clerkClient, clerkErrorMessage, ensureClerkUser };
