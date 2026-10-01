const { verifyToken } = require("@clerk/backend");
const httpStatus = require("http-status");
const config = require("../config/config");
const { clerkClient } = require("../clerk");
const ApiError = require("../utils/ApiError");

// Clerk session tokens don't include the email by default, but every
// controller looks users up by email — so resolve it once per user and cache
// it. Adding an `email` claim to the session token in the Clerk dashboard
// (Sessions → Customize session token) skips the lookup entirely.
const EMAIL_CACHE_TTL_MS = 10 * 60 * 1000;
const EMAIL_CACHE_MAX_ENTRIES = 10_000;
const emailCache = new Map();

async function resolveEmail(claims) {
  if (claims.email) return claims.email.toLowerCase();

  const cached = emailCache.get(claims.sub);
  if (cached && cached.expiresAt > Date.now()) return cached.email;

  const clerkUser = await clerkClient.users.getUser(claims.sub);
  const email = clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase();

  if (emailCache.size >= EMAIL_CACHE_MAX_ENTRIES) emailCache.clear();
  emailCache.set(claims.sub, {
    email,
    expiresAt: Date.now() + EMAIL_CACHE_TTL_MS,
  });
  return email;
}

const authCheck = async (req, res, next) => {
  let claims;
  try {
    claims = await verifyToken(req.headers.authtoken, {
      secretKey: config.clerk.secretKey,
      jwtKey: config.clerk.jwtKey,
      authorizedParties: config.clerk.authorizedParties,
    });
  } catch {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }

  try {
    const email = await resolveEmail(claims);
    if (!email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Account has no email");
    }

    req.user = { uid: claims.sub, email };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authCheck;
