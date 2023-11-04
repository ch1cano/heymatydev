const ejs = require('ejs')

const mail = require('./mail')

async function verified(data) {
  const { email } = data
  let template

  template = await ejs.renderFile(`${__dirname}/templates/verified.ejs`, {
    user: data
  })

  const message = {
    to: email,
    subject: 'Ваш аккаунт подтвержден.',
    // subject: 'Your Account has been Approved.',
    html: template
  }

  await mail(message)
}

module.exports = verified
