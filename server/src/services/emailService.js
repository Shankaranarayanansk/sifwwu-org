const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connected successfully');
    } catch (error) {
      logger.error('Email service connection failed:', error);
    }
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'SIFWWU Admin'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`, { messageId: result.messageId });
      return result;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - SIFWWU</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SIFWWU</h1>
            <p>South Indian Film Workers Welfare Union</p>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for registering with SIFWWU! To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd;">
              ${verificationUrl}
            </p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with SIFWWU, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 South Indian Film Workers Welfare Union. All rights reserved.</p>
            <p>48/37 Anjaneyar Koil Street, Essa Pallavaram, Chengalpattu, Tamil Nadu-600007</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address - SIFWWU',
      html,
      text: `Please verify your email address by visiting: ${verificationUrl}`
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - SIFWWU</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SIFWWU</h1>
            <p>South Indian Film Workers Welfare Union</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your SIFWWU account. Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd;">
              ${resetUrl}
            </p>
            <div class="warning">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This link will expire in 10 minutes for security reasons</li>
                <li>If you didn't request a password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2025 South Indian Film Workers Welfare Union. All rights reserved.</p>
            <p>48/37 Anjaneyar Koil Street, Essa Pallavaram, Chengalpattu, Tamil Nadu-600007</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - SIFWWU',
      html,
      text: `Reset your password by visiting: ${resetUrl} (This link expires in 10 minutes)`
    });
  }

  async sendWelcomeEmail(email, firstName) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SIFWWU</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #1e40af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SIFWWU!</h1>
            <p>South Indian Film Workers Welfare Union</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Welcome to the South Indian Film Workers Welfare Union community! We're excited to have you join our mission to support and uplift film industry professionals.</p>
            
            <h3>What you can do with your account:</h3>
            <div class="feature">
              <h4>🎬 Access Industry Resources</h4>
              <p>Get access to exclusive resources, job opportunities, and industry updates.</p>
            </div>
            <div class="feature">
              <h4>🤝 Connect with Professionals</h4>
              <p>Network with other film industry professionals and expand your connections.</p>
            </div>
            <div class="feature">
              <h4>📚 Educational Content</h4>
              <p>Access training materials, workshops, and skill development programs.</p>
            </div>
            <div class="feature">
              <h4>🛡️ Welfare Support</h4>
              <p>Learn about welfare programs and support services available to members.</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
            </p>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 South Indian Film Workers Welfare Union. All rights reserved.</p>
            <p>Contact: southindianfilmtrust@gmail.com | +91 9445799389</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to SIFWWU - Your Journey Begins!',
      html,
      text: `Welcome to SIFWWU, ${firstName}! We're excited to have you join our community.`
    });
  }

  async sendNotificationEmail(email, subject, message, type = 'info') {
    const colors = {
      info: '#1e40af',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${colors[type]}; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SIFWWU</h1>
            <p>South Indian Film Workers Welfare Union</p>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            <div>${message}</div>
          </div>
          <div class="footer">
            <p>&copy; 2025 South Indian Film Workers Welfare Union. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `SIFWWU - ${subject}`,
      html,
      text: message.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    });
  }
}

module.exports = new EmailService();