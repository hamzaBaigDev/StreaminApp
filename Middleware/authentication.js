const jwt = require('jsonwebtoken');
const jwtkey = 'e-comm';
const db = require("../model");

module.exports = async (req, res, next) => {
  try {
    const tokenWithBearer = req.headers['authorization'];
    if (!tokenWithBearer) {
      return res.status(401).send({ success: false, message: 'Access denied' });
    }

    const tokenArray = tokenWithBearer.split(' ');
    const token = tokenArray[1];
    if (!token) {
      return res.status(401).send({ success: false, message: 'Access denied' });
    }

    const decoded = jwt.verify(token, jwtkey);
    console.log({ decoded: decoded });

    const user = await db.ReactUser.findById(decoded.id);
    console.log({ user: user });

    if (!user || user.authToken !== token) {
      return res.status(401).send({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ success: false, message: 'Un-Authorized User Request' });
  }
}