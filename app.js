const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');

require('dotenv').config();

const app = express();

app.use(xmlparser());

app.use((req, res, next) => {
    const contentType = req.get('Accept');
    req.isXml = contentType && contentType.includes('application/xml');

    if (req.isXml && req.body && typeof req.body === 'object') {
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

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

app.options('*', cors());

app.use(function (err, req, res, next) {
    if (req.isXml) {
        const xml = builder.buildObject({ error: err.message });
        res.status(500).type('application/xml').send(xml);
    } else {
        res.status(500).json({ error: err.message });
    }
});

const authRoutes = require('./src/routes/authRoutes');
app.use("/auth", authRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use("/users", userRoutes);

const contentRoutes = require('./src/routes/contentRoutes');
app.use("/content", contentRoutes);

const port = process.env.PORT;

app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
);