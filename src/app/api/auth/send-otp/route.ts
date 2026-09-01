import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // 2. Delete any old OTPs for this email in PostgreSQL
    await prisma.otpVerification.deleteMany({
      where: { email: cleanEmail },
    });

    // 3. Save new OTP to Neon PostgreSQL
    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        otp,
        expiresAt,
      },
    });

    let emailSent = false;
    let resendErrorMessage = '';
    const resendApiKey = process.env.RESEND_API_KEY;

    // 4. Send real email via Resend if valid API key is present
    if (resendApiKey && resendApiKey.startsWith('re_') && !resendApiKey.includes('your_resend_api_key')) {
      try {
        const resend = new Resend(resendApiKey);
        const sendResult = await resend.emails.send({
          from: 'AllCollegeEvent <onboarding@resend.dev>',
          to: cleanEmail,
          subject: `${otp} is your AllCollegeEvent Verification Code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0d1222; padding: 30px; border-radius: 16px; color: #ffffff; border: 1px solid #1e293b;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #38bdf8; font-size: 24px; margin: 0;">AllCollegeEvent<span style="color: #a855f7;">.ai</span></h1>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">AI-Driven Collegiate Opportunity Platform</p>
              </div>
              <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 10px 0;">Your 6-digit verification code is:</p>
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; font-family: monospace;">${otp}</span>
                <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">Expires in 10 minutes</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          `,
        });

        if (sendResult.data && sendResult.data.id) {
          emailSent = true;
        } else if (sendResult.error) {
          console.error('Resend delivery error:', sendResult.error);
          resendErrorMessage = sendResult.error.message || 'Delivery failed';
        }
      } catch (emailErr: any) {
        console.error('Error sending email via Resend:', emailErr);
        resendErrorMessage = emailErr?.message || 'Resend error';
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? `Verification code sent to ${cleanEmail}`
        : `Verification code generated for ${cleanEmail}`,
      emailSent,
      resendErrorMessage: resendErrorMessage || undefined,
      // Provide OTP code in UI so testing always works even if external SMTP is unconfigured
      previewOtp: otp,
    });
  } catch (error: any) {
    console.error('Error in send-otp route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate verification code' },
      { status: 500 }
    );
  }
}
