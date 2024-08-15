const sgMail = require("@sendgrid/mail");

const API_KEY =
  "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";

sgMail.setApiKey(API_KEY);

exports.sendEmail = (mail, resetLink) => {
  const msg = {
    to: mail,
    from: "Zohar Sabag <theofficialtagia@walla.co.il>",
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reset Password
          </a>
        </p>
        <p>Please note that this link is only valid for the next 5 minutes. If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,<br>Tagia Team</p>
      </div>
    `,
  };

  sgMail.send(msg);
};
