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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f6f9;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1e293b;padding:25px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">
                📩 New Portfolio Contact
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">

              <p style="font-size:16px;color:#555;">
                You have received a new message from your portfolio website.
              </p>

              <table width="100%" cellpadding="12" cellspacing="0"
                style="border-collapse:collapse;margin-top:20px;">

                <tr style="background:#f8fafc;">
                  <td style="font-weight:bold;width:140px;">👤 Name</td>
                  <td>${name}</td>
                </tr>

                <tr>
                  <td style="font-weight:bold;">📧 Email</td>
                  <td>
                    <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">
                      ${email}
                    </a>
                  </td>
                </tr>

                <tr style="background:#f8fafc;">
                  <td style="font-weight:bold;">📝 Subject</td>
                  <td>${subject}</td>
                </tr>

              </table>

              <div style="margin-top:30px;">
                <h3 style="margin-bottom:10px;color:#1e293b;">
                  💬 Message
                </h3>

                <div style="
                  background:#f8fafc;
                  border-left:4px solid #2563eb;
                  padding:18px;
                  border-radius:8px;
                  color:#444;
                  line-height:1.7;
                ">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="padding:20px;background:#f8fafc;text-align:center;font-size:13px;color:#777;">
              This message was sent from your
              <strong>Portfolio Contact Form</strong>.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
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