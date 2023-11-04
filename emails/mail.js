/* eslint-disable func-style */
// const sendmail = require('sendmail')()
const { sendEmail } = require('../app/middleware/emailer/sendEmail')
// const nodemailer = require('nodemailer')

// const transport = nodemailer.createTransport({
//   // secure: true, // use SSL
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   auth: {
//     user: process.env.SMTP_EMAIL, // generated ethereal user
//     pass: process.env.SMTP_PASSWORD // generated ethereal password
//   },
//   tls: { rejectUnauthorized: false }
// })

// async function mail(message) {
//   const sentMessage = {
//     from: process.env.SMTP_EMAIL_SENDER,
//     to: message.to,
//     subject: message.subject,
//     html: message.html
//   }
//   transport.sendMail(sentMessage, (err, info) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(info)
//     }
//   })
// }

async function mail(message) {
  try {
    const user = {
      email: message.to
    }
    const data = {
      user,
      subject: message.subject,
      htmlMessage: message.html
    }
    sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`)
    )
    // await sendmail({
    //   from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    //   to: message.to,
    //   subject: message.subject,
    //   html: message.html
    // })

    return true
  } catch (e) {
    return false
  }
}

module.exports = mail
