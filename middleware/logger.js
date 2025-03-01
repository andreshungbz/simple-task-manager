// Filename: logger.js
// middleware to log the time, method and URL of every HTTP request

const logger = (req, res, next) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  // https://www.localeplanet.com/icu/en-BZ/index.html
  const now = new Date().toLocaleString('en-BZ', { hour12: true });

  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
};

export default logger;
