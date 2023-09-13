const logger = (req, next) => {
  if (!req) {
    next();
  };

  const { method, url, headers: { origin } } = req;
  console.log(`${origin} ${method} ${url}`);
  next();
}

module.exports = logger;