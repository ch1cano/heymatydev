const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')

/**
 * Sends registration email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendRegistrationEmailMessage = (locale = '', user = {}) => {
  // i18n.setLocale(locale)
  i18n.setLocale('ru')
  const subject = i18n.__('registration.SUBJECT')
  const htmlMessage = i18n.__(
    'registration.MESSAGE',
    user.name,
    process.env.FRONTEND_URL,
    user.emailConfirmationCode
  )
  prepareToSendEmail(user, subject, htmlMessage)
}

module.exports = { sendRegistrationEmailMessage }
