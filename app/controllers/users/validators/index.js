const { validateCreateUser } = require('./validateCreateUser')
const { validateDeleteUser } = require('./validateDeleteUser')
const { validateGetUser } = require('./validateGetUser')
const { validateUpdateUser } = require('./validateUpdateUser')
const { validateUpdateUser1 } = require('./validateUpdateUser1')

module.exports = {
  validateCreateUser,
  validateDeleteUser,
  validateGetUser,
  validateUpdateUser,
  validateUpdateUser1
}
