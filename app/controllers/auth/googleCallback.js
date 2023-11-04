const passport = require('passport')
const { saveUserAccessAndReturnToken } = require('./helpers')

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const googleCallback = (req, res, next) =>
  passport.authenticate(
    `google-role-${req.params.role}`,
    {
      session: false
    },
    async (err, user) => {
      if (err) {
        return res.redirect(
          `${
            process.env.GOOGLE_AUTH_FAILED_REDIRECT
          }?failedMessage=${encodeURIComponent(err.toString())}`
        )
      }

      if (user) {
        try {
          const tokenData = await saveUserAccessAndReturnToken(req, user)

          return res.json({
            token: tokenData.token
          })
          // return res.redirect(
          //   `${
          //     process.env.GOOGLE_AUTH_SUCCESS_REDIRECT
          //   }?token=${encodeURIComponent(tokenData.token)}`
          // )
        } catch (e) {
          console.error(e)
          return res.redirect(
            `${
              process.env.GOOGLE_AUTH_FAILED_REDIRECT
            }?failedMessage=${encodeURIComponent('Cannot retrieve the token')}`
          )
        }
      }

      res.redirect(
        `${
          process.env.GOOGLE_AUTH_FAILED_REDIRECT
        }?failedMessage=${encodeURIComponent('Unknown error')}`
      )
    }
  )(req, res, next)

module.exports = { googleCallback }
