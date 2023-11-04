require('dotenv-safe').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const path = require('path')
const {
  checkUserIsBlockedGlobal
} = require('./app/controllers/auth/helpers/checkUserIsBlockedGlobal.js')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/openapi.json')

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// root path
global.appRoot = path.resolve(__dirname)

// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
  const getExpeditiousCache = require('express-expeditious')
  const cache = getExpeditiousCache({
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    engine: require('expeditious-engine-redis')({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    })
  })
  app.use(cache)
}

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocument))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// socket setup

const http = require('http').Server(app)
// exporting for usage in sockets.js
exports.http = http
const io = require('./app/controllers/socket')
app.set('io', io)
app.use((req, res, next) => {
  req.io = io
  next()
})

// online users count status
let userCount = 0

io.sockets.on('connection', (socket) => {
  userCount++
  io.sockets.emit('userCount', { userCount })
  socket.on('disconnect', () => {
    userCount--
    io.sockets.emit('userCount', { userCount })
  })
})

// FOR CLIENT
// let socket = io.connect();

// socket.on('userCount', function (data) {
//   console.log(data.userCount);
// });

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/', express.static(`${__dirname}/client-react`))
app.use(checkUserIsBlockedGlobal)
app.use(require('./app/routes'))
// app.use(require('./app/routes/stripe'))
http.listen(app.get('port'))

// Init MongoDB
initMongo()

module.exports = app // for testing
