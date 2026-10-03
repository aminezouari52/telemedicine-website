/**
 * Counts one AI request against the signed-in user's hourly limit, kept by the
 * backend (POST /v1/patient/ai-usage). Call it from the AI route handlers
 * before every model call. Fails closed: if the backend can't be reached, the
 * request is refused rather than sent to Gemini unmetered.
 *
 * @param {string} authToken Clerk session token from `auth().getToken()`
 * @param {"chat" | "suggestions"} kind
 * @returns {Promise<{ ok: true } | { ok: false, status: number, message: string }>}
 */
export async function consumeAiUsage(authToken, kind) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_V1_URL}/patient/ai-usage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: authToken || "",
        },
        body: JSON.stringify({ kind }),
      },
    );
    if (res.ok) return { ok: true };

    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      status: res.status,
      message: data.message || "The AI assistant is unavailable right now.",
    };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "The AI assistant is unavailable right now.",
    };
  }
}
