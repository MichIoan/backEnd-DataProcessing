const xml2js = require('xml2js');
const builder = new xml2js.Builder();

function response(req, res, statusCode, data) {
    if (req.get('Accept') === 'application/xml') {
        const xml = builder.buildObject(data);
        res.status(statusCode).type('application/xml').send(xml);
    } else {
        res.status(statusCode).json(data);
    }
}

module.exports = response;