function prepareResponse(res, statusCode, data) {
    res.locals.status = statusCode;
    res.locals.data = data;
}

module.exports = prepareResponse;