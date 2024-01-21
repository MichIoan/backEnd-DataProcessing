function getToken(req) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const bearer = authHeader.split(" ");
        if (bearer.length == 2 && bearer[0] === "Bearer") {
            console.log(bearer[1]);
            return bearer[1]; // Return the token
        }
    }

    return null; // Return null if no token is found
}

module.exports = getToken;
