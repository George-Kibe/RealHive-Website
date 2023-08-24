import { auth } from 'express-oauth2-jwt-bearer'
import dotenv from "dotenv"
dotenv.config();
console.log("Domain",process.env.VITE_OAUTH_DOMAIN)

const jwtCheck = auth({
    audience: "http://localhost:8000",
    issuerBaseURL: process.env.VITE_OAUTH_DOMAIN,
    tokenSigningAlg: "RS256"
})

export default jwtCheck