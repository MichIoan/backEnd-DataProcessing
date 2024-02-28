function getToken(req) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const bearer = authHeader.split(" ");
        if (bearer.length == 2 && bearer[0] === "Bearer") {
            return bearer[1]; // Return the token
        }
    }

    return null;
}

module.exports = getToken;