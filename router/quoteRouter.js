const express = require("express");
const router = express.Router();

// Authentication Middleware
const auth = require("../middleware/auth");

// API Utils
const { apiGet, apiPost, apiEditQuote, apiDeleteQuote } = require("../utils/api");

// GET
router.get("/quotes", async (req, res) => {
  try {
    console.log("fetching...");
    const data = await apiGet("/api/quotes");
    res.render("quotes", { data, brukernavn: req.session.user });
  } catch (error) {
    res.status(500).send("Error fetching quote");
  }
});

router.get("/quotes/:brukernavn", async (req, res) => {
  try {
    console.log("fetching...");
    const søkBrukernavn = req.params.brukernavn;
    const data = await apiGet(`/api/quotes/${søkBrukernavn}`);
    res.render("bruker", { data, brukernavn: req.session.user, søkBrukernavn });
  } catch (error) {
    res.status(500).send("Error fetching quote");
  }
});

router.get("/lagresitater", auth.redirectIfLoggedOut, async (req, res) => {
  try {
    console.log("fetching...");

    const brukernavn = req.session.user;
    const data = await apiGet(`/api/lagresitater/${brukernavn}`);

    const error = req.session.error;
    req.session.error = null;
    res.render("lagresitater", { error, data, brukernavn });
  } catch (error) {
    res.status(500).send("Error fetching quote");
  }
});

// POST
router.post("/lagresitater", async (req, res) => {
  try {
    const { quotes } = req.body;
    const brukernavn = req.session.user;

    const result = await apiPost(`/api/lagresitater`, { quotes, brukernavn });

    if (result.ok && result.status === 201) {
      console.log("quote saved: ", quotes);
      return res.redirect("/lagresitater");
    } else {
      req.session.error = result.message || "Failed to publish your quote";
      return res.redirect("/lagresitater");
    }
  } catch (error) {
    console.log(error);
    req.session.error = "Error saving quote";
    res.redirect("/lagresitater");
  }
});

// EDIT & DELETE
router.post("/lagresitater/edit/:id", async (req, res) => {
  try {
    const { newQuotes } = req.body;
    const { id } = req.params;
    console.log("editing quote...")

    const result = await apiEditQuote(`/api/lagresitater/edit/${id}`, { quotes: newQuotes } );

    if (result.ok && result.status === 200) {
      console.log("Quotes updated successfully");
      res.redirect("/lagresitater");
    } else {
      console.log("Failed to edit")
    }
  } catch (error) {
    console.log(error);
    console.error("Error updating quotes:", error);
    res.send("Server error");
  }
});

router.post("/lagresitater/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("deleting quote...")

    const result = await apiDeleteQuote(`/api/lagresitater/delete/${id}`);

    if (result.ok && result.status === 200) {
      console.log("Quotes deleted successfully");
      res.redirect("/lagresitater");
    } else {
      console.log("Failed to delete")
      res.redirect("/lagresitater");
    }
  } catch (error) {
    console.log(error);
    console.error("Error deleting quotes:", error);
    res.send("Server error");
  }
});



// Export Router
module.exports = router;
