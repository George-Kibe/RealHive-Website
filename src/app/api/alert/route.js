import { sendEnquiryAlert } from '@/lib/emails';
import { NextResponse } from 'next/server';

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// contact-form enquiry: emailed to the team (see sendEnquiryAlert); replying goes to the visitor
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phoneNumber, 40);
  const message = clean(body.message, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new NextResponse('Please enter your name, a valid email and a message', { status: 422 });
  }
  try {
    await sendEnquiryAlert({ name, email, phone, message });
    return new NextResponse('Email sent successfully', { status: 200 });
  } catch (error) {
    console.error('Error sending enquiry', error);
    return new NextResponse('Error sending your message', { status: 500 });
  }
}
