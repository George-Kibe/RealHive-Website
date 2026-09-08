import jwt from "jsonwebtoken";

// generate Access token to last 15 minutes
export const generateAccessToken = (userId) => {
	const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	return token;
};

// generate refresh token valid for 365 days
export const generateRefreshToken = (userId) => {
	const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "365d",
	});
	return token;
};

export const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
}