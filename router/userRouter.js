const express = require("express");
const router = express.Router();

// Authentication Middleware
const auth = require("../middleware/auth");

// API Utils
const { apiGet, apiPost } = require("../utils/api");

// GET
router.get("/signin", auth.redirectIfLoggedIn, async (req, res) => {
  const error = req.session.error;
  req.session.error = null;
  res.render("signin", { error });
});

router.get("/signup", auth.redirectIfLoggedIn, async (req, res) => {
  const error = req.session.error;
  req.session.error = null;
  res.render("signup", { error });
});

// POST
router.post("/signin", async (req, res) => {
  try {
    console.log("signing in...");
    const { brukernavn, passord } = req.body;

    const result = await apiPost(`/api/signin`, { brukernavn, passord });

    if (result.ok && result.status === 200) {
      req.session.user = brukernavn;
      res.redirect("/");
    } else {
      req.session.error = result.message || "Sign in failed";
      res.redirect("/signin");
    }
  } catch (error) {
    req.session.error = "Error signing in user";
    res.redirect("/signin");
  }
});

router.post("/signup", async (req, res) => {
  try {
    console.log("signup user...");
    const { brukernavn, passord, repeatPassord } = req.body;

    const result = await apiPost(`/api/signup`, {
      brukernavn,
      passord,
      repeatPassord,
    });

    if (result.ok && result.status === 201) {
      console.log("User signed up:", brukernavn);
      return res.redirect("/signin");
    } else {
      req.session.error = result.message || "Sign up failed";
      return res.redirect("/signup");
    }
  } catch (error) {
    req.session.error = "Error signing up user";
    return res.redirect("/signup");
  }
});

// GET Logout
router.get("/signout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.redirect("/signin");
    console.log("signing out...")
  });
});

// Export Router
module.exports = router;
