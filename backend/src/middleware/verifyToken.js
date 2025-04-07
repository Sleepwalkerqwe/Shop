const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(`token - ${token}`);

    if (!token) return res.status(401).send({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) return res.status(401).send({ message: "Not valid token" });

    req.userId = decoded.userId;
    req.role = decoded.role;
    req.email = decoded.email;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again." });
    }
    console.error("error while verifying token", err);
    res.status(401).send({ message: "Error while verifying token" });
  }
};
module.exports = verifyToken;
