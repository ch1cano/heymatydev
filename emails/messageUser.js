const ejs = require('ejs')

const mail = require('./mail')

async function messageUser(user, model) {
  const { email } = user
  let template

  template = await ejs.renderFile(`${__dirname}/templates/messageToUser.ejs`, {
    user
  })

  const message = {
    to: email,
    subject: `У вас новое сообщение от ${model.name}`,
    html: template
  }

  await mail(message)
}

module.exports = messageUser
