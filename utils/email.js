const nodemailer = require("nodemailer");
const { htmlToText } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email; //recipient
    this.firstName = user.name.split(" ")[0]; //recipient firstname
    this.url = url;
    this.from = `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_FROM}>`; //sender name and email
  }

  newTransport() {
    if (process.env.NODE_ENV === "development") {
      // MailTrap
      return nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: true,
        auth: {
          user: "c866d71719ee4b",
          pass: "5d6ff07b787abe",
        },
      });
    }

    //shared hosting
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, //TLS
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
  }

  // Send the actual email
  async send(subject) {
    // 1) Render HTML based on a pug template
    const html = `  <body>
    <h1>Dear, ${firstname},</h1>
    <p>
      We have received a request to reset your password. If you did not initiate
      this request, please <strong>ignore</strong> this email.
    </p>
    <p>
      To reset your password, please click the link below:<br />
      ${this.url}
    </p>
    <p>
      If you are unable to click the link, you can also copy and paste the
      following URL into your browser:<br />
      ${this.url}
    </p>
    <p>
      This password reset link will expire in 10 minutes. If you continue to
      have trouble accessing your account, please contact our customer support
      team for assistance.
    </p>
    <p>
      Thank you,<br />
      Blinx Corporation
    </p>
  </body>`;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
