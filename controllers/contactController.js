import { createTransporter } from '../config/mailer.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long.',
      });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `
Name: ${name}
Email: ${email}

${message}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>New Portfolio Contact</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <h3>Message</h3>

          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
}