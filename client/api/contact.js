import { Resend } from 'resend';

export default async function handler(req, res) {
  // Initialize Resend inside the handler to ensure env vars are fresh
  const resend = new Resend(process.env.RESEND_API_KEY);
  const version = "v1.0.4"; // Incrementing this to track deploy

  // Check if API KEY exists
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ success: false, error: 'Internal Server Error: Missing Config', version });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON body' });
      }
    }
    
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields', received: Object.keys(body || {}) });
    }

    // 1. Notify the owner (Aditya)
    // Note: Using 'onboarding@resend.dev' is the safest fallback if the domain isn't verified yet
    await resend.emails.send({
      from: 'SkillSynergy <onboarding@resend.dev>',
      to: 'aditya.s70222@gmail.com',
      subject: `New Contact: ${name} via SkillSynergy`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">New Message Received</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `
    });

    // 2. Send confirmation to the user (optional, might fail if onboarding@resend.dev is used for external recipients)
    try {
      await resend.emails.send({
        from: 'SkillSynergy <onboarding@resend.dev>',
        to: email,
        subject: 'We received your message!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981;">Hi ${name},</h2>
            <p>Thank you for reaching out to SkillSynergy. We've received your message and our team will get back to you shortly.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p style="font-size: 12px; color: #666;">This is an automated confirmation. Please do not reply directly to this email.</p>
          </div>
        `
      });
    } catch (confError) {
      console.warn('Confirmation email failed (likely unverified domain):', confError);
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send message',
      details: error.message || 'Unknown error',
      rawError: error,
      version
    });
  }
}
