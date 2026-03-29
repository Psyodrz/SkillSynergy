const cron = require('node-cron');
const { Resend } = require('resend');
const { Pool } = require('pg');
require('dotenv').config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ============================================================================
// PUBLIC IMAGE URLS (hosted on Supabase Storage)
// ============================================================================
const SUPABASE_STORAGE = process.env.SUPABASE_URL + '/storage/v1/object/public/email-assets';
const IMAGES = {
  logo: `${SUPABASE_STORAGE}/logo.png`,
  banner: `${SUPABASE_STORAGE}/email-banner.png`,
  mentor: `${SUPABASE_STORAGE}/email-mentor-icon.png`,
  aiLearning: `${SUPABASE_STORAGE}/email-ai-learning-icon.png`,
};

// ============================================================================
// PREMIUM RESPONSIVE HTML EMAIL TEMPLATE
// ============================================================================
function buildEmailHTML(userName) {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>SkillSynergy</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    /* Responsive */
    @media only screen and (min-width: 660px) {
      .email-container { width: 660px !important; max-width: 660px !important; }
      .feature-cards-wrapper { display: flex !important; gap: 16px !important; }
      .feature-card { width: 48% !important; display: inline-block !important; vertical-align: top !important; }
      .feature-card-inner { min-height: 220px !important; }
      .stats-number { font-size: 32px !important; }
      .hero-title { font-size: 32px !important; }
      .hero-subtitle { font-size: 16px !important; }
    }

    @media only screen and (max-width: 659px) {
      .email-container { width: 100% !important; }
      .feature-card { width: 100% !important; display: block !important; }
      .inner-padding { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; width: 100%; -webkit-font-smoothing: antialiased;">

  <!-- Full-width background wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 30px 16px;">

        <!-- Main email container -->
        <table role="presentation" class="email-container" width="660" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6); max-width: 660px;">

          <!-- Logo Row -->
          <tr>
            <td align="center" style="padding: 28px 40px 12px; background-color: #0f172a;">
              <img src="${IMAGES.logo}" alt="SkillSynergy Logo" width="56" height="56" style="display: block; border: 0;">
            </td>
          </tr>

          <!-- Banner Image (full width) -->
          <tr>
            <td>
              <img src="${IMAGES.banner}" alt="SkillSynergy" width="660" style="display: block; width: 100%; height: auto; border: 0;">
            </td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td align="center" class="inner-padding" style="padding: 28px 40px 8px;">
              <h1 class="hero-title" style="margin: 0; font-size: 28px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.5px;">
                Skill<span style="color: #10b981;">Synergy</span>
              </h1>
              <p class="hero-subtitle" style="margin: 8px 0 0; font-size: 14px; color: #64748b; letter-spacing: 2.5px; text-transform: uppercase;">
                Connect &middot; Learn &middot; Grow
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td class="inner-padding" style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #334155, transparent);"></div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="inner-padding" style="padding: 28px 40px 14px;">
              <h2 style="margin: 0; font-size: 22px; color: #e2e8f0; font-weight: 600;">
                Hey ${userName} &#x1F44B;
              </h2>
              <p style="margin: 14px 0 0; font-size: 15px; color: #94a3b8; line-height: 1.75;">
                Your learning journey on SkillSynergy is waiting! Here's what you can explore today:
              </p>
            </td>
          </tr>

          <!-- Feature Cards (side-by-side on desktop, stacked on mobile) -->
          <tr>
            <td class="inner-padding" style="padding: 10px 40px 20px;">
              <!--[if mso]>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="280" valign="top">
              <![endif]-->
              <div class="feature-card" style="display: inline-block; width: 47%; vertical-align: top; margin-right: 3%;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td align="center" style="padding: 24px 20px 8px;">
                      <img src="${IMAGES.mentor}" alt="Mentors" width="72" height="72" style="display: block; border-radius: 12px;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 20px 24px; text-align: center;">
                      <h3 style="margin: 0; font-size: 16px; color: #10b981; font-weight: 700;">Find Expert Mentors</h3>
                      <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.55;">
                        Connect with instructors who match your goals using AI-powered matching.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso]>
              </td><td width="20"></td><td width="280" valign="top">
              <![endif]-->
              <div class="feature-card" style="display: inline-block; width: 47%; vertical-align: top;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td align="center" style="padding: 24px 20px 8px;">
                      <img src="${IMAGES.aiLearning}" alt="AI Learning" width="72" height="72" style="display: block; border-radius: 12px;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 20px 24px; text-align: center;">
                      <h3 style="margin: 0; font-size: 16px; color: #06b6d4; font-weight: 700;">AI Learning Paths</h3>
                      <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.55;">
                        Get personalized skill recommendations crafted by our AI assistant.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso]>
              </td></tr></table>
              <![endif]-->
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 10px 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981, #06b6d4);">
                    <a href="https://skillsynergy.online/app/discover" style="display: inline-block; padding: 15px 48px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.5px;">
                      Explore Skills Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stats Row -->
          <tr>
            <td class="inner-padding" style="padding: 20px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 12px;">
                <tr>
                  <td align="center" width="33%" style="padding: 20px 12px;">
                    <p class="stats-number" style="margin: 0; font-size: 28px; font-weight: 700; color: #10b981;">500+</p>
                    <p style="margin: 6px 0 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">Skills</p>
                  </td>
                  <td align="center" width="33%" style="padding: 20px 12px; border-left: 1px solid #1e293b; border-right: 1px solid #1e293b;">
                    <p class="stats-number" style="margin: 0; font-size: 28px; font-weight: 700; color: #06b6d4;">100+</p>
                    <p style="margin: 6px 0 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">Mentors</p>
                  </td>
                  <td align="center" width="33%" style="padding: 20px 12px;">
                    <p class="stats-number" style="margin: 0; font-size: 28px; font-weight: 700; color: #8b5cf6;">24/7</p>
                    <p style="margin: 6px 0 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">AI Support</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td class="inner-padding" style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #334155, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="inner-padding" style="padding: 24px 40px 30px;">
              <p style="margin: 0; text-align: center; font-size: 13px; color: #475569; line-height: 1.6;">
                You're receiving this because you signed up on
                <a href="https://skillsynergy.online" style="color: #10b981; text-decoration: none;">SkillSynergy</a>.
              </p>
              <p style="margin: 12px 0 0; text-align: center; font-size: 12px; color: #334155;">
                &copy; 2026 SkillSynergy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

const sendPromotionalEmails = async () => {
  console.log('[Email Scheduler] Running daily promotional email job...');
  
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing from environment');
  }

  try {
    const sqlQuery = "SELECT full_name, email FROM profiles WHERE email IS NOT NULL AND email != ''";
    const result = await pool.query(sqlQuery);

    const users = result.rows;
    console.log('[Email Scheduler] Found ' + users.length + ' users to email.');

    if (users.length === 0) return { success: true, count: 0 };

    const BATCH_SIZE = 100;
    const sentBatches = [];
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      
      const emailsToSend = batch.map(user => ({
        from: 'SkillSynergy <noreply@skillsynergy.online>',
        to: user.email,
        subject: '\uD83D\uDE80 New skills & mentors are waiting for you on SkillSynergy!',
        html: buildEmailHTML(user.full_name || 'Learner')
      }));

      const response = await resend.batch.send(emailsToSend);
      sentBatches.push(response);
      console.log('[Email Scheduler] Batch ' + (Math.floor(i/BATCH_SIZE) + 1) + ' sent.');
    }

    console.log('[Email Scheduler] Daily promotional job completed successfully.');
    return { success: true, count: users.length, batches: sentBatches.length };
  } catch (error) {
    console.error('[Email Scheduler] Error running job:', error);
    throw error;
  }
};

const startEmailScheduler = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      await sendPromotionalEmails();
    } catch (e) {
      // Error already logged in sendPromotionalEmails
    }
  });

  console.log('[Email Scheduler] Cron job initialized. Will run every day at 10:00 AM.');
};

module.exports = { startEmailScheduler, buildEmailHTML, sendPromotionalEmails };
