const express = require("express");
const router = express.Router();

// API Utils
const { apiGet, apiPost } = require("../utils/api");

// Authentication Middleware
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
    try {
        console.log("fetching...")
        const data = await apiGet("/api/quote")
        res.render("index", { data, brukernavn: req.session.user });
    } catch (error) {
    res.status(500).send("Error fetching quote");
  }
})

// Profile Page
router.get("/profile", auth.redirectIfLoggedOut, async (req, res) => {
  res.render("profile", { brukernavn: req.session.user });
});

// Export Router
module.exports = router;