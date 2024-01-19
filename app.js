const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xmlparser = require("express-xml-bodyparser");
const xml2js = require("xml2js");
const builder = new xml2js.Builder();
require("dotenv").config();

// app
const app = express();

// Middleware setup
app.use(xmlparser()); // Parse XML requests

// Custom middleware to flatten XML structure
app.use((req, res, next) => {
  const contentType = req.get("Content-Type");
  req.isXml = contentType && contentType.includes("application/xml");

  if (req.isXml && req.body && typeof req.body === "object") {
    const rootElement = Object.keys(req.body)[0];
    if (req.body[rootElement] instanceof Object) {
      req.body = req.body[rootElement];

      for (let key in req.body) {
        if (Array.isArray(req.body[key]) && req.body[key].length === 1) {
          req.body[key] = req.body[key][0];
        }
      }
    }
  }

  next();
});

app.use(bodyParser.json()); // Parse JSON requests
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
app.use(cors({ origin: true, credentials: true })); // CORS configuration

app.options("*", cors()); // CORS preflight

// Error handling middleware
app.use(function (err, req, res, next) {
  if (req.isXml) {
    const xml = builder.buildObject({ error: err.message });
    res.status(500).type("application/xml").send(xml);
  } else {
    res.status(500).json({ error: err.message });
  }
});

// Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);

const passwordReset = require("./src/routes/passwordReset");
app.use("/passwordReset", passwordReset);

const subscriptionRoutes = require("./src/routes/subscriptionRoute");
app.use("/subscription", subscriptionRoutes);

// Response middleware
app.use(function (req, res) {
  if (req.isXml || req.headers["accept"] === "application/xml") {
    const xml = builder.buildObject(res.locals);
    res.status(res.locals.status).type("application/xml").send(xml);
  } else {
    res.status(res.locals.status).json(res.locals);
  }
});

// Port configuration
const port = process.env.PORT || 8081;

// Start the server
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
