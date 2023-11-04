const rules = [
  {
    rule: /\s/i,
    message: 'Название профиля не должно содержать пробелов.'
  },
  {
    rule: /^[0-9]*$/i,
    message: 'Название профиля не должно состоять только из цифр.'
  },
  {
    rule: /^[a-z0-9_]*$/,
    message:
      'Название профиля может содержать только строчные латинские символы, цифры и знак подчеркивания.',
    not: true
  },
  {
    rule: /^_/i,
    message: 'Название профиля не может начинаться с подчеркивания.'
  }
]

const validateProfileUrl = (pu) => {
  const errors = []
  rules.forEach((rule) => {
    const check = rule.not ? !rule.rule.test(pu) : rule.rule.test(pu)
    if (check) {
      errors.push(rule.message)
    }
  })
  return errors
}

module.exports = { validateProfileUrl }
