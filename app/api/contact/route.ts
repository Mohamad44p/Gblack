import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    const { firstname, lastname, email, message } = await request.json();

    // Local testing transporter
    const localTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '222371@ppu.edu.ps',
            pass: process.env.GMAIL_APP_PASSWORD, // Use an app password for Gmail
        },
    });

    // Production transporter (commented out)
    /*
    const productionTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    */

    // Choose the appropriate transporter
    const transporter = localTransporter; // Change this to productionTransporter when going live

    try {
        await transporter.sendMail({
            from: '222371@ppu.edu.ps', // For testing
            to: '222371@ppu.edu.ps', // For testing
            subject: 'New Contact Form Submission',
            html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
    }
}