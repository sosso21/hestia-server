const nodemailer = require("nodemailer");
const sendinBlue = require("nodemailer-sendinblue-transport");
 
const config={fromEmail: "Hestia",
apiKey: "Ca2GSTtU45RZjf7O",}

const sendEmail = (
  targetEmail,
  subjectEmail,
  bodyEmail,
  { fromEmail, apiKey } = config 
) => {
  const transporter = nodemailer.createTransport(
    sendinBlue({
      apiKey: apiKey,
    })
  );
 
  const mailOptions = {
    from:fromEmail,
    to: targetEmail,
    subject: subjectEmail,
    html: bodyEmail,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = sendEmail;
