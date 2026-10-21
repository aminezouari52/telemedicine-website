// Longest search text used in a regex; anything past it is ignored.
const MAX_SEARCH_LENGTH = 100;

// Escape regex metacharacters so user input is matched literally, and cap the
// length so a crafted pattern cannot make MongoDB do unbounded work.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { escapeRegex, MAX_SEARCH_LENGTH };
