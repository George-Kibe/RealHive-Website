import nodemailer from 'nodemailer';
import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
    RESET_OTP_EMAIL_TEMPLATE,
    QUOTE_EMAIL_TEMPLATE
} from "./emailTemplates";

// Email Verification 
export const sendVerificationEmail = async (email, verificationToken) => {
    // Create a Nodemailer transport object (configure with your email provider)
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
            to: email,
            subject: `Welcome to RealHive, Verify Your Email`,
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

// welcome email
export const sendWelcomeEmail = async (email, name) => {
    // Create a Nodemailer transport object (configure with your email provider)
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
            from: 'Realhive Real Estate Website',
            to: email,
            subject: `Welcome to Realhive, ${name}`,
            html: WELCOME_EMAIL_TEMPLATE.replaceAll("{username}", name.toUpperCase()),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

// send email with reset token 
export const sendResetPasswordEmail = async (email, resetToken) => {
     // Create a Nodemailer transport object (configure with your email provider)
     const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

	try {
        const mailOptions = {
            from: 'buenasconsultants@gmail.com',
            to: email,
            subject: `Password Reset Request`,
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending reset email`, error);
		throw new Error(`Error sending reset email: ${error}`);
	}
}
// send email with OTP to reset password
export const sendResetPasswordMobileEmail = async (email, otp) => {
    // Create a Nodemailer transport object (configure with your email provider)
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
            to: email,
            subject: `Password Reset Request`,
            html: RESET_OTP_EMAIL_TEMPLATE.replace("{otp}", otp),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending reset email`, error);
		throw new Error(`Error sending reset email: ${error}`);
	}
}

// email reset success
export const sendPasswordResetSuccessEmail = async (email, username) => {
    // Create a Nodemailer transport object (configure with your email provider)
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
            to: email,
            subject: `Password Reset Success`,
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replaceAll("{username}", username.toUpperCase()),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending reset success email`, error);
		throw new Error(`Error sending reset success email: ${error}`);
	}
}

const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const gmailTransport = () => nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// email the visitor their quotation PDF
export const sendQuoteEmail = async ({ to, name, quote, pdf, formatMoney, siteUrl, phone }) => {
    const row = (label, value) =>
        `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(label)}</td>` +
        `<td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${escapeHtml(value)}</td></tr>`;
    const rows = [
        ...quote.items.map((i) => row(i.name, `from ${formatMoney(i.from, quote.currency)}${i.monthly ? " / month" : ""}`)),
        quote.projectFrom > 0 ? row("Estimated project investment", `from ${formatMoney(quote.projectFrom, quote.currency)}`) : "",
        quote.weeksFrom > 0 ? row("Typical timeline", `from ${quote.weeksFrom} weeks`) : "",
    ].join("");
    const html = QUOTE_EMAIL_TEMPLATE
        .replaceAll("{reference}", escapeHtml(quote.reference))
        .replace("{name}", escapeHtml(name))
        .replace("{rows}", rows)
        .replace("{currency}", escapeHtml(quote.currency))
        .replace("{phone}", escapeHtml(phone))
        .replace("{siteUrl}", escapeHtml(siteUrl))
        .replace("{siteHost}", escapeHtml(siteUrl.replace(/^https?:\/\//, "")));
    await gmailTransport().sendMail({
        from: `"RealHive Consultants" <${process.env.SENDER_EMAIL}>`,
        to,
        replyTo: process.env.SENDER_EMAIL,
        subject: `Your project estimate (${quote.reference})`,
        html,
        attachments: [{ filename: `RealHive-estimate-${quote.reference}.pdf`, content: Buffer.from(pdf), contentType: "application/pdf" }],
    });
};

// tell the team a quote was requested (a sales lead), with the same PDF.
// Internal only: unlike everything the visitor sees, it shows country, tier and USD.
export const sendQuoteNotification = async ({ quote, contact, pdf, formatMoney }) => {
    const both = (local, usd) => quote.currency === "USD" ? formatMoney(usd, "USD") : `${formatMoney(local, quote.currency)} (≈ ${formatMoney(usd, "USD")})`;
    const lines = [
        ["Reference", quote.reference],
        ["Name", contact.name],
        ["Email", contact.email],
        ["Company", contact.company || "-"],
        ["Country", quote.countryDetected ? `${quote.countryName} (from IP)` : "Unknown (location not detected)"],
        ["Pricing tier", quote.tierLabel],
        ["Build level", quote.buildLevelLabel],
        ["Project from", both(quote.projectFrom, quote.projectFromUsd)],
        ["Support from", quote.monthlyFrom ? `${both(quote.monthlyFrom, quote.monthlyFromUsd)} / month` : "-"],
        ["Notes", contact.notes || "-"],
    ];
    const html = `<h2>New quote request ${escapeHtml(quote.reference)}</h2><table>` +
        lines.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top;">${escapeHtml(k)}</td><td style="white-space:pre-line;">${escapeHtml(v)}</td></tr>`).join("") +
        `</table>`;
    await gmailTransport().sendMail({
        from: `"RealHive website" <${process.env.SENDER_EMAIL}>`,
        to: process.env.QUOTES_NOTIFY_EMAIL || process.env.SENDER_EMAIL,
        replyTo: contact.email,
        subject: `New quote request: ${contact.name} (${quote.countryName}, from ${formatMoney(quote.projectFromUsd, "USD")})`,
        html,
        attachments: [{ filename: `RealHive-estimate-${quote.reference}.pdf`, content: Buffer.from(pdf), contentType: "application/pdf" }],
    });
};

// ---- consultation bookings ----

const bookingInbox = () => process.env.BOOKINGS_NOTIFY_EMAIL || process.env.QUOTES_NOTIFY_EMAIL || process.env.SENDER_EMAIL;

const bookingShell = (title, body, siteUrl) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(title)}</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
<div style="background-color: #ffffff; padding: 28px; border-radius: 8px;">${body}</div>
<p style="text-align: center; color: #94a3b8; font-size: 12px;">RealHive Consultants · <a href="${escapeHtml(siteUrl)}" style="color: #0077A3;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a></p>
</body></html>`;

const button = (href, label) =>
    `<p style="margin: 20px 0;"><a href="${escapeHtml(href)}" style="background-color: #0077A3; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold;">${escapeHtml(label)}</a></p>`;

// confirmation to the visitor, with an .ics file and a cancel link
export const sendBookingConfirmation = async ({ booking, when, ics, cancelUrl, siteUrl, phone }) => {
    const body = `
        <h1 style="margin: 0 0 4px; font-size: 22px; color: #0077A3;">Your consultation is booked</h1>
        <p style="margin: 0 0 20px; color: #64748b; font-size: 13px;">Reference ${escapeHtml(booking.reference)}</p>
        <p>Hi ${escapeHtml(booking.name)},</p>
        <p>Thanks for booking a consultation with RealHive Consultants. Here are the details:</p>
        <p style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px;"><strong>${escapeHtml(when)}</strong><br>
        <span style="color: #64748b; font-size: 13px;">Times in ${escapeHtml(booking.timezone)} · Video call (Google Meet)</span></p>
        <p>We'll email you the Google Meet link before the call. The attached calendar file adds it to your calendar.</p>
        <p style="font-size: 13px; color: #64748b;">You told us you'd like to discuss:<br>${escapeHtml(booking.topic).replace(/\n/g, "<br>")}</p>
        <p style="font-size: 13px;">Can't make it? <a href="${escapeHtml(cancelUrl)}" style="color: #0077A3;">Cancel this booking</a> and book another time, or call us on ${escapeHtml(phone)}.</p>
        <p style="margin-bottom: 0;">Talk soon,<br>RealHive Consultants</p>`;
    await gmailTransport().sendMail({
        from: `"RealHive Consultants" <${process.env.SENDER_EMAIL}>`,
        to: booking.email,
        replyTo: process.env.SENDER_EMAIL,
        subject: `Consultation booked: ${when} (${booking.reference})`,
        html: bookingShell("Your consultation is booked", body, siteUrl),
        icalEvent: { method: "PUBLISH", filename: "consultation.ics", content: ics },
    });
};

// notification to the team, with a pre-filled Google Calendar link (add Meet, save)
export const sendBookingNotification = async ({ booking, whenCompany, whenVisitor, companyTimezone, calendarLink, adminUrl, siteUrl }) => {
    const rows = [
        ["When (your time)", `${whenCompany} (${companyTimezone})`],
        ["Their time", `${whenVisitor} (${booking.timezone})`],
        ["Name", booking.name],
        ["Email", booking.email],
        ["Company", booking.company || "-"],
        ["Reference", booking.reference],
        ["Topic", booking.topic],
    ];
    const body = `
        <h1 style="margin: 0 0 12px; font-size: 22px; color: #0077A3;">New consultation booking</h1>
        <table role="presentation" style="border-collapse: collapse;">${rows.map(([k, v]) =>
            `<tr><td style="padding: 4px 12px 4px 0; color: #64748b; vertical-align: top; white-space: nowrap;">${escapeHtml(k)}</td><td style="white-space: pre-line;">${escapeHtml(v)}</td></tr>`).join("")}</table>
        ${button(calendarLink, "Create in Google Calendar")}
        <p style="font-size: 13px; color: #64748b;">The event opens pre-filled with the time, details and ${escapeHtml(booking.email)} as a guest. Click <em>Add Google Meet video conferencing</em>, then <em>Save</em> and send the invitation.</p>
        <p style="font-size: 13px;"><a href="${escapeHtml(adminUrl)}" style="color: #0077A3;">Manage bookings</a></p>`;
    await gmailTransport().sendMail({
        from: `"RealHive website" <${process.env.SENDER_EMAIL}>`,
        to: bookingInbox(),
        replyTo: booking.email,
        subject: `New consultation: ${booking.name}, ${whenCompany}`,
        html: bookingShell("New consultation booking", body, siteUrl),
    });
};

// cancellation: to the visitor when the team cancels, or to the team when the visitor does
export const sendBookingCancellation = async ({ booking, when, to, byVisitor, rebookUrl, siteUrl, ics }) => {
    const body = byVisitor
        ? `<h1 style="margin: 0 0 12px; font-size: 22px; color: #0077A3;">Consultation cancelled by the visitor</h1>
           <p><strong>${escapeHtml(booking.name)}</strong> (${escapeHtml(booking.email)}) cancelled their consultation on <strong>${escapeHtml(when)}</strong> (${escapeHtml(booking.reference)}). Remove the Google Calendar event if you created one.</p>`
        : `<h1 style="margin: 0 0 12px; font-size: 22px; color: #0077A3;">Your consultation has been cancelled</h1>
           <p>Hi ${escapeHtml(booking.name)},</p>
           <p>Unfortunately we've had to cancel your consultation on <strong>${escapeHtml(when)}</strong> (${escapeHtml(booking.reference)}). Sorry for the inconvenience. Please pick another time that suits you:</p>
           ${button(rebookUrl, "Book another time")}
           <p style="margin-bottom: 0;">RealHive Consultants</p>`;
    await gmailTransport().sendMail({
        from: byVisitor ? `"RealHive website" <${process.env.SENDER_EMAIL}>` : `"RealHive Consultants" <${process.env.SENDER_EMAIL}>`,
        to: to ?? bookingInbox(),
        replyTo: byVisitor ? booking.email : process.env.SENDER_EMAIL,
        subject: byVisitor ? `Cancelled: consultation with ${booking.name} (${when})` : `Your consultation on ${when} has been cancelled`,
        html: bookingShell("Consultation cancelled", body, siteUrl),
        ...(ics ? { icalEvent: { method: "CANCEL", filename: "consultation.ics", content: ics } } : {}),
    });
};
