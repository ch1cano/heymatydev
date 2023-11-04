const path = require('path')

const Graceful = require('@ladjs/graceful')

// required
const Bree = require('bree')

const bree = new Bree()

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] })
graceful.listen()

// start all jobs (this is the equivalent of reloading a crontab):
bree.start()
