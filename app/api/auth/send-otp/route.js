import dbConnect from '/lib/mongodb';
import { User } from 'models/models';

export async function POST(req) {
  await dbConnect();

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email is required.' }), {
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

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.otp = otp;
    user.otp_expires = otp_expires;
    await user.save();

    // In a real application, you would send an email here.
    // For now, we will log it to the console for testing.
    console.log(`Sending OTP ${otp} to ${email}`);

    return new Response(JSON.stringify({ success: true, message: 'OTP sent to email.' }), {
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



const testSendOtp = async () => {
  const requestData = {
    email: 'devrshib@gmail.com' // Replace with a user's email from your database
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    console.log('API Response:', result);

  } catch (error) {
    console.error('An error occurred:', error);
  }
};

testSendOtp();