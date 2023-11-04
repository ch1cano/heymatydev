const ejs = require('ejs')

const mail = require('./mail')

async function verifiedModel(user, model) {
  const { email } = user
  let template

  template = await ejs.renderFile(`${__dirname}/templates/messageToModel.ejs`, {
    user: model
  })

  const message = {
    to: email,
    subject: `You Got New Message from ${user.name}`,
    html: template
  }

  await mail(message)
}

module.exports = verifiedModel
