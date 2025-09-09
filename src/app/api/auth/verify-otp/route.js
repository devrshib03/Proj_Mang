import dbConnect from '@/lib/mongodb';
import { User } from '@/models/models';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ success: false, message: 'Email and OTP are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the OTP matches and has not expired
    if (user.otp !== otp || new Date() > user.otp_expires) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid or expired OTP.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined; // Clear the OTP after successful verification
    user.otp_expires = undefined;
    await user.save();

    return new Response(JSON.stringify({ success: true, message: 'User verified successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
