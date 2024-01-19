function getJWTTokenFromHeader(req) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const bearer = authHeader.split(" ");
    if (bearer.length == 2 && bearer[0] === "Bearer") {
      const bearerToken = bearer[1];
      req.token = bearerToken; // Assign token to the request object
      return req.token;
    }

    return;
  }

  return;
}

module.exports = getJWTTokenFromHeader;
