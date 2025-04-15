import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifJWT = asyncHandler(async (req, res, next) => {
    try {
        
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Unauthorized request: Missing or invalid Authorization header" });
        }


        const token = authorizationHeader.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid access token: Token is invalid or incomplete" });
        }


        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Invalid access token: User not found" });
        }
        if (user.authtoken === null) {
            return res.status(401).json({ message: "Invalid access token: Not found in database" });
        }
        req.user = user

        next();
    } catch (error) {

        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
});


export { verifJWT };
