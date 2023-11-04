/* eslint-disable max-statements */
const Message = require('../models/message')
const User = require('../models/user')
const Payment = require('../models/payment')
const OnlineUsers = require('../models/onlineUsers')
const { http } = require('../../server')
const MessageToUser = require('../../emails/messageUser')
const MessageToModel = require('../../emails/messageModel')
const io = require('socket.io')
const socketio = io(http, { cors: { origin: '*' } })
const randomstring = require('randomstring')
const siofu = require('socketio-file-upload')
const fs = require('fs')
const moment = require('moment')
// const sharp = require('sharp')

const holdDays = 1 // Additional days to hold payment by default

socketio.on('connection', (socket) => {
  console.log(`New User Logged In with ID ${socket.id}`)
  const uploader = new siofu()

  uploader.listen(socket)
  var fileUploadList = []

  // Collect message and insert into database
  socket.on('chatMessage', async (data, callback) => {
    console.log('prepare dir', data.from)
    let path = `${appRoot}/public/messages/${data.from}`
    fs.mkdir(path, { recursive: true }, (err) => {})
    uploader.dir = path
    // recieves message from client-end along with sender's and reciever's details
    // let data =  {
    //    from: "senderid",
    //    to: "receiverid",
    //    message: "Hi",
    //  }

    const senderUser = await User.findById(data.from)
    if (!senderUser) {
      // socket.emit('message', { msg: 'Sender User doest not exist' })
      if (typeof callback === 'function') {
        const resp = {
          ok: false,
          msg: 'Sender User doest not exist'
        }
        return callback(resp)
      }
      return false
    }

    const receeiverUser = await User.findById(data.to)
    if (!receeiverUser) {
      // socket.emit('message', { msg: 'Receiver User doest not exist' })
      if (typeof callback === 'function') {
        const resp = {
          ok: false,
          msg: 'Receiver User doest not exist'
        }
        return callback(resp)
      }
      return false
    }

    if (
      receeiverUser.blockExpires &&
      moment(receeiverUser.blockExpires).isAfter(moment())
    ) {
      if (typeof callback === 'function') {
        const resp = {
          ok: false,
          msg: 'Receiver User is blocked'
        }
        return callback(resp)
      }
      return false
    }

    if (senderUser.role === 'girl' && receeiverUser.role === 'girl') {
      if (typeof callback === 'function') {
        const resp = {
          ok: false,
          msg: 'You cant chat with another girl'
        }
        return callback(resp)
      }
      return false
    }

    const mess = {
      from: data.from,
      to: data.to,
      message: data.message,
      withFiles: data.withFiles ? true : false
      // attachment: data.withFiles ? attachment : null,
    }
    if (data.withFiles) {
      mess.attachment = data.messagefiles.filter((file) => file.type)
    }

    const newMessage = new Message(mess)

    // checking if sender is user and has enough balance or bundled messages to chat with model
    let savedSender
    if (senderUser.role === 'user') {
      const { pricePerMessage } = receeiverUser
      const bundle = senderUser.messageBundles.find(
        (mb) => mb.model.toString() === receeiverUser._id.toString()
      )
      if (bundle && bundle.messages) {
        bundle.messages--
      } else if (senderUser.balance >= pricePerMessage) {
        senderUser.balance -= pricePerMessage

        // Planning payment for a model
        const newPayment = new Payment({
          registerDate: moment().toDate(),
          periodStart: moment().toDate(),
          periodEnd: moment().toDate(),
          amount: pricePerMessage,
          finished: false,
          message: newMessage._id,
          plannedPayoutDate: moment().add(holdDays, 'days').toDate(),
          from: senderUser,
          to: receeiverUser
        })
        const savedPayment = await newPayment.save()
        newMessage.payment = savedPayment
      } else {
        const resp = {
          ok: false,
          msg: 'You dont have enough balance or bundled messages to chat with this model'
        }
        return callback(resp)
      }

      // Donation check
      if (data.donation) {
        // donation code here
        const donation = Math.floor(data.donation)
        if (!!donation && senderUser.balance >= donation && donation > 0) {
          senderUser.balance -= donation
          // Planning payment for a model
          const newPayment = new Payment({
            registerDate: moment().toDate(),
            periodStart: moment().toDate(),
            periodEnd: moment().toDate(),
            amount: donation,
            finished: false,
            donation: newMessage._id,
            plannedPayoutDate: moment().add(holdDays, 'days').toDate(),
            from: senderUser,
            to: receeiverUser
          })
          const savedPayment = await newPayment.save()
          newMessage.donation = savedPayment
        } else {
          const resp = {
            ok: false,
            msg: 'Incorrect donation'
          }
          return callback(resp)
        }
      }

      savedSender = await senderUser.save()
    }

    const savedMessage = await newMessage
      .save()
      .then((msg) => msg.populate('donation payment').execPopulate())

    if (savedMessage) {
      socket.emit('message', savedMessage)
    }

    // const onlineUser = await OnlineUsers.findOne({ userId: data.to })
    const relayTo = await OnlineUsers.find({ userId: data.to })
    const relayFrom = await OnlineUsers.find({ userId: data.from })
    // console.log(onlineUser)
    if ([...relayTo, ...relayFrom]) {
      ;[...relayTo, ...relayFrom].forEach((ouser) => {
        try {
          socket.to(ouser.socketId).emit('message', savedMessage)
        } catch (error) {
          console.log(error)
        }
      })
    } else {
      const user = await User.findById(data.to)
      const model = await User.findById(data.from)
      if (data.to == 'user') {
        if (model.type == 'girl' && user.type == 'user') {
          await MessageToUser(user, model)
        }
      } else if (data.to == 'girl') {
        await MessageToModel(user, model)
      }
    }

    if (typeof callback === 'function') {
      const resp = {
        ok: true,
        savedSender
      }
      return callback(resp)
    }
  })

  // save files
  uploader.on('start', (e) => {
    console.log(e)
    // console.log(fileUploadList)
    // finding file in fileUploadList array to rename it
    // let ind = fileUploadList.findIndex((f) => f.originalname === e.file.name)
    // if (ind === -1) {
    //   socket.emit('file-error', `Не найден файл: ${e.file.name}`)
    //   return false
    // } else if (!fileUploadList[ind].type) {
    //   // uploader.abort(e.file.id, socket)
    //   socket.emit('file-error', `Недопустимый формат файла: ${e.file.name}`)
    //   return false
    // } else {
    //   e.file.name = fileUploadList[ind].savedname
    // }

    if (!e.file.meta.type) {
      socket.emit('file-error', `Недопустимый формат файла: ${e.file.name}`)
      return false
    }
    e.file.name = e.file.meta.nameToSave
  })

  uploader.on('error', async (e) => {
    console.log('error-file', e)

    Message.updateOne(
      { 'attachment.name': e.file.name },
      { $set: { 'attachment.$.error': true } },
      { upsert: false }
    )
      .then((result) => {
        console.log(result)
      })
      .catch((err) => console.error(err))
      .finally(async () => {
        const relayTo = await OnlineUsers.find({ userId: e.file.meta.to })
        const relayFrom = await OnlineUsers.find({ userId: e.file.meta.from })
        if ([...relayTo, ...relayFrom]) {
          ;[...relayTo, ...relayFrom].forEach((ouser) => {
            try {
              socket.to(ouser.socketId).emit('fileuploadingerror', e.file.name)
            } catch (error) {
              console.log(error)
            }
          })
        }
        socket.emit('fileuploadingerror', e.file.name)
      })
  })

  uploader.on('saved', async (e) => {
    console.log('success-file', e)

    // compressing downloaded file - do not turn it on for now!!!
    // if (e.file.success && ind !== -1 && fileUploadList[ind].type === 'image') {
    //   const path = `${appRoot}/public/messages/${e.file.meta.idUser}`
    //   try {
    //     const res = await sharp(e.file.pathName)
    //       .jpeg({
    //         mozjpeg: true,
    //         force: false
    //       })
    //       .toFile(`${path}/compressed-${e.file.name}`)
    //     console.log(res)
    //     console.log(
    //       `Compression success: ${e.file.name} (${e.file.size}) -> compressed-${e.file.name} (${res.size})`
    //     )
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // end of compressing

    Message.updateOne(
      { 'attachment.name': e.file.name },
      { $set: { 'attachment.$.uploaded': true } },
      { upsert: false }
    )
      .then((result) => {
        console.log(result)
      })
      .catch((err) => console.error(err))
      .finally(async () => {
        const relayTo = await OnlineUsers.find({ userId: e.file.meta.to })
        const relayFrom = await OnlineUsers.find({ userId: e.file.meta.from })
        if ([...relayTo, ...relayFrom]) {
          ;[...relayTo, ...relayFrom].forEach((ouser) => {
            try {
              socket
                .to(ouser.socketId)
                .emit('fileuploadingsuccess', e.file.name)
            } catch (error) {
              console.log(error)
            }
          })
        }
        socket.emit('fileuploadingsuccess', e.file.name)
      })
  })

  socket.on('userDetails', async (data, callback) => {
    // checks if a new user has logged in and recieves the established chat details

    // data must be in the object like from user id and to user id
    const online = await OnlineUsers.findOne({
      userId: data.fromUser,
      socketId: socket.id
    })
    if (!online) {
      const onlineUser = new OnlineUsers({
        userId: data.fromUser,
        socketId: socket.id
      })
      await onlineUser.save()
    }
    const from = []
    const to = []
    if (data.fromUser) {
      from.push(data.fromUser)
      to.push(data.fromUser)
    }
    if (data.toUser) {
      from.push(data.toUser)
      to.push(data.toUser)
    }

    const messages = await Message.find({
      $or: [{ from: { $in: from } }, { to: { $in: to } }, { isDeleted: false }]
    })
      .lean(true)
      .populate('donation payment')
    //.projection({ _id: 0 })
    //.toArray()
    // console.log(messages)
    let resps = []
    messages.forEach((m) => {
      if (
        m.from.toString() !== data.fromUser &&
        !resps.includes(m.from.toString())
      )
        resps.push(m.from.toString())
      if (m.to.toString() !== data.fromUser && !resps.includes(m.to.toString()))
        resps.push(m.to.toString())
    })

    const respStatuses = await Promise.all(
      resps.map(async (r) => {
        const st = {
          respid: r,
          responline: false
        }
        const online = await OnlineUsers.findOne({
          userId: r
        })
        if (online) st.responline = true
        return st
      })
    )

    socket.emit('chathistory', {
      messages,
      userId: data.fromUser,
      respStatuses
    }) // emits the entire chat history to client

    socketio.emit('responline', data.fromUser)
    if (typeof callback === 'function') {
      callback(true)
    }
  })

  socket.on('userSubscribed', async ({ userId, modelId }, callback) => {
    const relayTo = await OnlineUsers.find({ userId: modelId })
    relayTo.forEach((ouser) => {
      try {
        socket.to(ouser.socketId).emit('newSubscription', userId)
      } catch (error) {
        console.log(error)
      }
    })
    if (typeof callback === 'function') {
      callback(true)
    }
  })

  socket.on('checkonline', async (userId) => {
    const online = await OnlineUsers.findOne({
      userId
    })
    if (online) {
      socket.emit('useronline', userId)
    }
  })

  socket.on('logout', async (userId, callback) => {
    //const offline = await OnlineUsers.findById(userId)
    const offline = await OnlineUsers.findOne({
      userId: userId,
      socketId: socket.id
    })
    if (offline) {
      console.log(`User ${socket.id} logged out...`)
      socketio.emit('respoffline', offline.userId)
      await offline.remove()
    }
    if (typeof callback === 'function') {
      callback(true)
    }
  })

  socket.on('disconnect', async (userId) => {
    //const offline = await OnlineUsers.findById(userId)
    const offline = await OnlineUsers.findOne({ socketId: socket.id })
    if (offline) {
      console.log(`User ${socket.id} went offline...`)
      socketio.emit('respoffline', offline.userId)
      await offline.remove()
    }
  })

  /** todo Сделал аналогично другим роутам колбеки, но нужно добавить проверки и безопасность, что это тот пользователь, который писал или кому писали сообщение (не на основе присланных данных, а из сокета).
   *  todo Ни в одном роуте здесь такого нет, можно заслать что-угодно и от кого-угодно, это пздц.
   *  todo Сейчас можно отправить сообщение от другого аккаунта и, если такой пользователь существет - оно отправится и донат спишется */
  socket.on('deleteMessage', async (_id, callback) => {
    const message = await Message.findOne({ _id })
    const { userId } = await OnlineUsers.findOne({ socketId: socket.id })
    if (!userId) {
      console.log(`User ${socket.id} not online...`)
      if (typeof callback === 'function') {
        callback(false)
      }
    } else {
      if (message.from !== userId && message.to !== userId) {
        console.log(`It is not your message. Id: ${_id}, User: ${socket.id}`)
        if (typeof callback === 'function') {
          callback(false)
        }
      } else {
        message.isDeleted = true
        await message.save()

        if (typeof callback === 'function') {
          callback(true)
        }
      }
    }
  })
})

module.exports = socketio
