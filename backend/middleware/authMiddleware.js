const { createClient } = require("@supabase/supabase-js");

/**
 * Express middleware to authenticate requests using a Supabase JWT.
 * It verifies the token and attaches an authenticated Supabase client
 * and the user object to the request.
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Extract the token from the 'Authorization' header.
        // The header format is "Bearer YOUR_JWT_TOKEN".
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ error: "Authentication required. No token provided." });
        }

        // 2. Create a temporary, user-specific Supabase client.
        // This client is initialized with the user's token, allowing it
        // to perform actions on behalf of that user.
        const supabase = createClient(
            process.env.DB_URL,
            process.env.DB_API_KEY,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        // 3. Validate the token by fetching the user's details from Supabase.
        // If the token is invalid or expired, this will fail.
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) {
            console.error("Token validation error:", error.message);
            return res.status(401).json({ error: "Invalid or expired token." });
        }

        if (!user) {
            return res
                .status(401)
                .json({ error: "Authentication failed. User not found." });
        }

        // 4. Attach the user object and the authenticated Supabase client to the request.
        // The controller can now access these via `req.user` and `req.supabase`.
        req.user = user;
        req.supabase = supabase;

        // 5. Pass control to the next middleware or the route handler (e.g., createQuizAndGame).
        next();
    } catch (error) {
        console.error("Unhandled error in authMiddleware:", error);
        res.status(500).json({
            error: "Internal server error during authentication.",
        });
    }
};

module.exports = authMiddleware;
