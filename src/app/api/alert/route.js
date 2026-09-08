import {NextResponse} from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const body = await req.json()
  const {name, email, message, phoneNumber} = body;
   // Create a Nodemailer transport object
   const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  try {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: "georgekibew@gmail.com",
        subject: `New Enquiry from ${name} on RealHive Consultants`,
        html: ENQUIRY_ALERT_TEMPLATE.replaceAll("{client_name}", name)
            .replace("{client_email}", email)
            .replace("{client_message}", message)
            .replace("{client_phone}", phoneNumber),
      }
    // Send the email
    const response = await transporter.sendMail(mailOptions);
    return new NextResponse("Email sent successfully", { status: 200 });
  } catch (error) {
    console.error(`Error sending verification`, error);
    return new NextResponse(`Error sending verification`, { status: 500 });
  }
}

const ENQUIRY_ALERT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Enquiry Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .content h2 {
            margin-top: 0;
            font-size: 18px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 20px;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h1>New Enquiry from {client_name}</h1>
        </div>
        
        <!-- Content Section -->
        <div class="content">
            <h2>Hello RealHive Team,</h2>
            <p>You have received a new enquiry from the website! Here are the details:</p>

            <p><strong>📧 Client Information:</strong></p>
            <p><strong>Name:</strong> {client_name}<br>
            <strong>Email:</strong> {client_email}</p>
             <strong>Phone:</strong> {client_phone}</p>

            <p><strong>💬 Message:</strong></p>
            <blockquote>"{client_message}"</blockquote>

            <p>We recommend following up with this enquiry as soon as possible to ensure a prompt response.</p>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>Best Regards, <br>
            RealHive Consultants Team <br>
            <a href="https://www.realhiveconsultants.com">www.realhiveconsultants.com</a><br>
            Phone: +254704817466 <br>
            Email: george@realhiveconsultants.com</p>

            <p><em>This email was automatically generated. Please do not reply to this address.</em></p>
        </div>
    </div>
</body>
</html>
`