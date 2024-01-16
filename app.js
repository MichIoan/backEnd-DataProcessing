const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xmlparser = require('express-xml-bodyparser');
const xml2js = require('xml2js');
const builder = new xml2js.Builder();
require('dotenv').config();

// Custom XML to JSON Middleware
const xmlToJsonMiddleware = require('./src/middlewares/xmlToJson');

// app
const app = express();

app.use(xmlparser());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

app.options('*', cors());

// Use the custom middleware for XML to JSON conversion
app.use(xmlToJsonMiddleware);

// Error handling and response conversion middleware (keep these if needed)
app.use((req, res, next) => {
    if (req.isXml) {
        const error = res.locals.error;
        const xml = builder.buildObject({ message: error.message });
        res.type('application/xml').send(xml);
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    if (req.isXml) {
        const xml = builder.buildObject(res.locals);
        res.status(res.locals.status).type('application/xml').send(xml);
    } else {
        res.status(res.locals.status).json(res.locals);
    }
});

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.locals = { status: status, error: message };
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
const server = app.listen(port, () => console.log(`server is running on port ${ port }`));