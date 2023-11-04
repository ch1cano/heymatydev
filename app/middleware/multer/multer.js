const multer = require('multer')
const mkdirp = require('mkdirp')

String.prototype.removeSpaces = function () {
  return this.replace(/\s+/g, '-').trim()
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const publicPath = './public/media'
    mkdirp.sync(publicPath)
    cb(null, publicPath)
  },
  filename(req, file, cb) {
    const fileName = file.originalname.removeSpaces()
    cb(null, `${Date.now()}-${fileName}`)
  }
})

exports.upload = multer({
  storage
})
