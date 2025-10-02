const nodemailer = require("nodemailer");

exports.sendMail = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `GoMeal <${process.env.email}`,
      to: user.email,
      subject: user.subject,
      html: user.html,
    });

    console.log(`Message sent : ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`error sending email: ${error.message}`);
    throw error;
  }
};
console.log("User:", process.env.MAILGUN_DOMAIN_NAME);
console.log("Pass:", process.env.MAILGUN_SMTP_PASSWORD ? "Loaded ✅" : "Missing ❌");
