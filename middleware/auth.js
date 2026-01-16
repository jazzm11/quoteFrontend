function redirectIfLoggedOut(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect("/signin");
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session.user || req.user) {
    return res.redirect("/");
  }
  next();
}

module.exports = { redirectIfLoggedOut, redirectIfLoggedIn };
