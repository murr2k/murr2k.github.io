const { transporter } = require('../config/email');
const { logger } = require('../utils/logger');

// Get recipient email based on app
const getRecipientEmail = (appName) => {
  const appEmails = process.env.APP_EMAILS 
    ? JSON.parse(process.env.APP_EMAILS)
    : {};
    
  return appEmails[appName] || process.env.DEFAULT_EMAIL || 'murr2k@gmail.com';
};

// Generate HTML email template
const generateEmailHtml = (data, appName) => {
  const fields = Object.entries(data)
    .filter(([key]) => !['source', 'honeypot'].includes(key))
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${label}:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${value || 'N/A'}</td>
        </tr>
      `;
    })
    .join('');
    
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          New Form Submission
        </h2>
        <p style="color: #7f8c8d; margin-bottom: 20px;">
          Received from: <strong>${appName}</strong>
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          ${fields}
        </table>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent by the Form Handler API</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email
const generateEmailText = (data, appName) => {
  const fields = Object.entries(data)
    .filter(([key]) => !['source', 'honeypot'].includes(key))
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `${label}: ${value || 'N/A'}`;
    })
    .join('\n');
    
  return `
New Form Submission from ${appName}

${fields}

--
This email was sent by the Form Handler API
  `.trim();
};

// Send email
const sendEmail = async (formData, appName) => {
  const recipientEmail = getRecipientEmail(appName);
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Form Handler" <noreply@murraykopit.com>',
    to: recipientEmail,
    subject: formData.subject || `New message from ${formData.name} via ${appName}`,
    text: generateEmailText(formData, appName),
    html: generateEmailHtml(formData, appName),
    replyTo: formData.email
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully`, {
      messageId: info.messageId,
      to: recipientEmail,
      app: appName
    });
    return info;
  } catch (error) {
    logger.error(`Failed to send email`, {
      error: error.message,
      to: recipientEmail,
      app: appName
    });
    throw error;
  }
};

module.exports = { sendEmail };