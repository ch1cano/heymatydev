const ejs = require('ejs')

const mail = require('./mail')

const verifiedModel = async (data) => {
  const { email } = data
  const { verified } = data
  const templateFile = verified
    ? `${__dirname}/templates/verificationSuccessLetter.ejs`
    : `${__dirname}/templates/needsVerificationLetter.ejs`
  const template = await ejs.renderFile(templateFile, {
    user: data
  })

  const message = {
    to: email,
    subject: 'Verification process',
    html: template
  }

  await mail(message)
}

module.exports = verifiedModel
