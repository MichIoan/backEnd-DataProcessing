const xmlparser = require('express-xml-bodyparser');

const xmlToJsonMiddleware = (req, res, next) => {
    if (req.isXml && req.body) {
        const rootTag = Object.keys(req.body)[0];
        req.body = req.body[rootTag];

        for (let key in req.body) {
            if (Array.isArray(req.body[key]) && req.body[key].length === 1) {
                req.body[key] = req.body[key][0];
            }
        }

        console.log('Converted JSON:', req.body);
    }
    next();
};

module.exports = xmlToJsonMiddleware;