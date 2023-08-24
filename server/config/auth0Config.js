import { auth } from 'express-oauth2-jwt-bearer'
import dotenv from "dotenv"
dotenv.config();

console.log("Domain",process.env.VITE_OAUTH_DOMAIN)

const jwtCheck = auth({
    audience: "https://dev-ejjut34veu43h66o.us.auth0.com/api/v2/",
    issuerBaseURL: process.env.VITE_OAUTH_DOMAIN,
    tokenSigningAlg: "RS256"
})

export default jwtCheck