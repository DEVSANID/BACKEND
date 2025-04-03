import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,  
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Event Management" <noreply@example.com>`,
      to,
      subject,
      text
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
