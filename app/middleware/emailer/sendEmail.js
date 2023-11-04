// const sendmail = require('sendmail')()
const nodemailer = require('nodemailer')
// const mg = require('nodemailer-mailgun-transport')

const sender = function sendEmail({ email, html, subject }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: email,
    subject,
    html
  }

  return transporter.sendMail(mailOptions)
  // , (error, info) => {
  //   if (error) {
  //     console.error(error)
  //     return error
  //   } else if (info) {
  //     return info
  //   }
  // })
}

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data = {}, callback) => {
  // const auth = {
  //   auth: {
  //     // eslint-disable-next-line camelcase
  //     api_key: process.env.EMAIL_SMTP_API_MAILGUN,
  //     domain: process.env.EMAIL_SMTP_DOMAIN_MAILGUN
  //   }
  //   // host: 'api.eu.mailgun.net' // THIS IS NEEDED WHEN USING EUROPEAN SERVERS
  // }
  // const transporter = nodemailer.createTransport(mg(auth))
  // const mailOptions = {
  //   from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
  //   to: `${data.user.name} <${data.user.email}>`,
  //   subject: data.subject,
  //   html: data.htmlMessage
  // }
  // transporter.sendMail(mailOptions, (err) => {
  //   if (err) {
  //     return callback(false)
  //   }
  //   return callback(true)
  // })

  try {
    // await sendmail({
    //   from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    //   to: `${data.user.name} <${data.user.email}>`,
    //   subject: data.subject,
    //   html: data.htmlMessage
    // })
    const resp = await sender({
      email: data.user.email,
      html: data.htmlMessage,
      subject: data.subject
    })
    console.log(resp)
    return callback(true)
  } catch (e) {
    console.log(e)
    return callback(false)
  }
}

module.exports = { sendEmail }
