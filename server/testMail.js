/* import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "server1.s-tech.de",
  port: 587,
  secure: false,
  auth: {
    user: "info@christineschwarz.life",
    pass: "9tyF51%f4",
  },
  tls: {
    rejectUnauthorized: false, // ignore domain mismatch if needed
  },
});

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: '"Christine Schwarz" <info@christineschwarz.life>',
      to: "mmiladaniel@gmail.com",
      subject: "Mail Test ✔",
      text: "This is a test email from Nodemailer",
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testMail();
 */