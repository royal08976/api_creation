const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authenticateAPIRequest = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const apiKey = req.headers["x-api-key"];

    if (!authHeader || !apiKey) {
        return res.status(403).json({ message: "Token and API Key are required" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid token format. Use 'Bearer <token>'" });
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.apiKey !== apiKey) {
            return res.status(403).json({ message: "Invalid API Key or Token" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateAPIRequest;
