import axios from "axios";
import { NextResponse } from "next/server";

// middleware function to generate token
const generateToken = async(req, res) => {
    const secret = process.env.MPESA_SECRET_KEY
    const consumer = process.env.MPESA_CONSUMER_KEY
    const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");

    try {
        const response = await axios.get("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
            headers: {
                "Authorization": `Basic ${auth}`
            }
        })
        // console.log("Access Token: ", response.data)
        const token = response.data.access_token
        return token
        // next()
    } catch (error) {
        console.log("Error: ", error)
        // res.status(400).json({error})   
    } 
}

async function handler(req,res){
    const {method} = req;
    
    if (method === "POST"){
        const body = await req.json()
        const {phone, amount} = body;
        let phoneNumber = ''
        // const timestampTest =  Date.now().toString()
        const date = new Date();
        const timestamp = date.getFullYear() +
            ("0" + (date.getMonth() + 1 )).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2) 
    
        const shortcode = process.env.MPESA_PAYBILL
        const passkey = process.env.MPESA_PASSKEY
        const password = new Buffer.from(shortcode + passkey + timestamp).toString("base64")
        if (phone.startsWith("+254")) {
            phoneNumber = phone.substring(1)
        }else if (phone.startsWith("254")) {
            phoneNumber = phone
        }
        else if (phone.startsWith("0")) {
            phoneNumber = `254${phone.substring(1)}`
        }
        console.log("Phone Number: ", phoneNumber)
        const token = await generateToken()
        console.log("Generated Token: ", token)

        try {
            const response = await axios.post(
                "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                {
                    "BusinessShortCode": shortcode,    
                    "Password": password,    
                    "Timestamp": timestamp,    
                    "TransactionType": "CustomerPayBillOnline",    // CustomerBuyGoodsOnline
                    "Amount": amount,    
                    "PartyA": phoneNumber,    
                    "PartyB": shortcode,    
                    "PhoneNumber": phoneNumber,    
                    "CallBackURL": "https://mydomain.com/pat",    
                    "AccountReference": phoneNumber, // Paybill Account Number    
                    "TransactionDesc":"test"
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                }    
            )
            console.log("Response Data: ", response.data)
            const data = JSON.stringify(response.data)
            return new NextResponse(data, {status: 201})
        } catch (error) {
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "GET"){
      
      return new NextResponse({phone, amount}, {status: 200})
    }
    if (method === "PUT"){
        const body = await req.json()
        const {phone, amount} = body;
        const data = {"phone": phone, "amount": amount, "status": "success"} 
        const response = JSON.stringify(data)   
        return new NextResponse(response, {status: 200})
      }
    
}

export { handler as GET, handler as POST , handler as PUT};