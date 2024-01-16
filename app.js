const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xmlparser = require('express-xml-bodyparser');
const xml2js = require('xml2js');
const builder = new xml2js.Builder();
require('dotenv').config();

// app
const app = express();

app.use(xmlparser());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

app.options('*', cors())

// Middleware to check if the request is XML
app.use(function (req, res, next) {
    req.isXml = req.is('application/xml');
    next();
});

// Middleware to convert XML to JSON if request is XML
app.use(function (req, res, next) {
    if (req.isXml && req.body) {
        req.body = req.body.root;
    }
    next();
});

app.use((req, res, next) => {
    if (req.isXml) {
        const error = res.locals.error;
        const xml = builder.buildObject({ message: error.message });
        res.type('application/xml').send(xml);
    } else {
        next();
    }
});

//middleware to convert JSON to XML if initial request was XML
app.use(function (req, res, next) {
    if (req.isXml) {
        const xml = builder.buildObject(res.locals);
        res.status(res.locals.status).type('application/xml').send(xml);
    } else {
        res.status(res.locals.status).json(res.locals);
    }
});

//error handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.locals = { status: status, error: message }; // storing the error in res.locals
    next();
});

// routes 
const authRoutes = require('./src/routes/authRoutes');
app.use("/auth", authRoutes);

const passwordReset = require('./src/routes/passwordReset');
app.use("/passwordReset", passwordReset);

//port
const port = process.env.PORT || 8081;

// listener
const server = app.listen(port, () => console.log(`server is running on port ${port}`));