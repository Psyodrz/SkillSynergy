require('dotenv').config();
const { Resend } = require('resend');
const { buildEmailHTML } = require('./emailScheduler.js');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  const targetEmail = 'srivastavabhavya786@gmail.com';
  console.log(`Sending premium promotional email to ${targetEmail}...`);

  try {
    const data = await resend.emails.send({
      from: 'SkillSynergy <noreply@skillsynergy.online>',
      to: targetEmail,
      subject: '🚀 New skills & mentors are waiting for you on SkillSynergy!',
      html: buildEmailHTML('Bhavya') // Customized name parameter
    });

    console.log('Premium email sent successfully! Target:', targetEmail);
    console.log('Resend Delivery ID:', data.id);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();
