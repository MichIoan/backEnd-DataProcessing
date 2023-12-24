const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.get('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    req.collectionId = decoded.collectionId; // Add collectionId to the request if needed
    next();
  });
};

module.exports = verifyToken;
