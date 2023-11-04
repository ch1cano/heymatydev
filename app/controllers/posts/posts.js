/* eslint-disable max-statements */
const { handleError } = require('../../middleware/utils')
const { validationResult } = require('express-validator')
const Post = require('../../models/post')
const User = require('../../models/user')
const Subscription = require('../../models/sub')
const Favourite = require('../../models/favourite')

exports.createPost = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  try {
    const { title, description, isPublic } = req.body
    const { images, videos } = req.files

    const post = new Post({
      title,
      description,
      images,
      videos,
      userId: req.user._id,
      isPublic
    })
    await post.save()

    return res.status(200).json({ post, message: 'Пост успешно создан' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.updateUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  try {
    const postCheck = await Post.findById(req.params.id)

    if (!postCheck) {
      return res.status(404).send('Пост с таким ID не найден')
    }

    if (postCheck.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Вы не авторизованы' })
    }

    const { title, description, isPublic, existedImages, existedVideos } =
      req.body
    const { images, videos } = req.files
    const existedImagesArr = JSON.parse(existedImages)
    const existedVideosArr = JSON.parse(existedVideos)

    Post.findById(req.params.id, (err, post) => {
      if (err || !post) {
        res.json({ message: 'Поста не существует' })
      } else {
        post.title = title
        post.description = description
        post.isPublic = isPublic
        post.images = existedImagesArr
        post.videos = existedVideosArr
        images ? (post.images = post.images.concat(images)) : ''
        videos ? (post.videos = post.videos.concat(videos)) : ''

        post.save()
        if (!post) {
          return res.status(404).send('Поста с таким ID не существует')
        }
        res.send(post)
      }
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getPost = async (req, res) => {
  try {
    let isUserSubscribed = false
    const post = await Post.findById(req.params.id).populate('userId', [
      '_id',
      'name',
      'email',
      'role'
    ])
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' })
    }
    const isMine = req.user._id == post.userId._id.toString()
    const now = new Date()
    const subscriptionCheck = await Subscription.findOne({
      subscriber: req.user._id,
      model: post.userId,
      ends: { $gte: now }
    })

    if (subscriptionCheck) {
      isUserSubscribed = true
    }

    const showUrls = isUserSubscribed || isMine || post.isPublic

    // Hiding file urls from unsubscribed
    const images = post.images.map((file) => {
      file.path = `${'https:' + '//'}${req.get('host')}//${file.path}`
      file.filename = showUrls ? file.filename : false
      file.path = showUrls ? file.path : false
      file.originalname = showUrls ? file.originalname : false
      return file
    })
    const videos = post.videos.map((file) => {
      file.path = `${'https:' + '//'}${req.get('host')}//${file.path}`
      file.filename = showUrls ? file.filename : false
      file.path = showUrls ? file.path : false
      file.originalname = showUrls ? file.originalname : false
      return file
    })
    post.images = images
    post.videos = videos
    return res.status(200).json({ post, message: 'Пост получен' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getGirlPost = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).populate(
      'userId',
      ['name', 'email', 'role']
    )
    const allPosts = posts.map((post) => {
      const images = post.images.map((file) => {
        file.path = `${'https:' + '//'}${req.get('host')}//${file.path}`
        return file
      })

      const videos = post.videos.map((file) => {
        file.path = `${'https:' + '//'}${req.get('host')}//${file.path}`
        return file
      })
      post.images = images
      post.videos = videos
      return post
    })
    return res.status(200).json({ posts: allPosts, message: 'Посты получены' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(400).json({ message: 'Пост не существует' })
    }

    if (post.userId.toString() != req.user._id.toString()) {
      return res.status(403).json({ message: 'Вы не авторизованы' })
    }

    await post.remove()

    return res.status(200).json({ message: 'Пост удален' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    const condition = { isPublic: true }
    const { page } = req.query
    const limit = 5
    const posts = await Post.find(condition)
      .populate('userId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Post.find(condition).countDocuments()

    return res.status(200).json({
      posts,
      message: 'Все публичные посты девушки',
      length: posts.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getFeedPosts = async (req, res) => {
  console.log(req.query)
  const { data: rawData, page } = req.query
  const parsedData = JSON.parse(rawData || '{}')

  const { ages, languages, cities, country } = parsedData

  const limit = 5;

  const query = {
    $or: [
      { blockExpires: { $lte: new Date() } },
      { blockExpires: { $exists: false } }
    ]
  }

  if (ages && ages.length) {
    query.age = { $in: ages }
  }
  if (languages && languages.length) {
    query.languages = { $in: languages }
  }
  if (cities && cities.length) {
    query.city = { $in: cities }
  }
  if (country) {
    query.country = country
  }

  const subscriptions = await Favourite.find({ userId: req.user.id }).lean()
  if (subscriptions.length === 0) {
    return res.status(200).json({
      posts: [],
      message: "Oh, you have no matys! Let's start a search together."
    })
  }

  const favoritesModelIds = subscriptions.map((sub) => sub.modelId)
  query._id = { $in: favoritesModelIds }
  const modelIds = await User.find(query)

  const totalDocs = await Post.countDocuments({
    userId: { $in: modelIds },
    isPublic: true
  })

  const totalPages = Math.ceil(totalDocs / limit)
  const posts = await Post.find({ userId: { $in: modelIds }, isPublic: true })
    .populate('userId')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean()
    .exec()

  return res.status(200).json({
    posts,
    totalDocs,
    totalPages,
    currentPage: page
  })
}

exports.getAllPostsGirl = async (req, res) => {
  try {
    const { id } = req.params
    const condition = { isPublic: true, userId: id }
    const { page } = req.query
    const limit = 5
    const modelCheck = await User.findById(id)

    if (!modelCheck) {
      return res.status(400).json({ message: 'Девушки не существует' })
    }

    const posts = await Post.find(condition)
      .populate('userId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Post.find(condition).countDocuments()

    return res.status(200).json({
      posts,
      message: `All the public posts of the ${modelCheck.name} model`,
      length: posts.length,
      totalDocs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllMyPostsGirl = async (req, res) => {
  try {
    const modelId = req.user._id
    const condition = { userId: modelId }
    const modelCheck = await User.findById(modelId)

    if (!modelCheck) {
      return res.status(400).json({ message: 'Девушки не существует' })
    }
    const posts = await Post.find(condition).sort({ createdAt: -1 }).exec()

    return res.status(200).json({
      posts,
      message: `All posts of the ${modelCheck.name} model`
    })
  } catch (e) {
    console.log(e)
    return handleError(res, e)
  }
}

exports.getAllPrivateGirl = async (req, res) => {
  try {
    const { id } = req.params
    const condition = { isPublic: false, userId: id }
    const { page } = req.query
    const limit = 5
    let isUserSubscribed = false
    const isMine = req.user._id == id

    const modelCheck = await User.findById(id)

    if (!modelCheck) {
      return res.status(400).json({ message: 'Девушки не существует' })
    }

    const now = new Date()
    const subscriptionCheck = await Subscription.findOne({
      subscriber: req.user._id,
      model: id,
      ends: { $gte: now }
    })

    if (subscriptionCheck) {
      isUserSubscribed = true
    }

    const posts = await Post.find(condition)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
      .exec()

    // Hiding file urls for unsubscribed users
    posts.forEach((r) => {
      r.images.forEach((att) => {
        att.filename = isUserSubscribed || isMine ? att.filename : false
        att.path = isUserSubscribed || isMine ? att.path : false
        att.originalname = isUserSubscribed || isMine ? att.originalname : false
      })
      r.videos.forEach((att) => {
        att.filename = isUserSubscribed || isMine ? att.filename : false
        att.path = isUserSubscribed || isMine ? att.path : false
        att.originalname = isUserSubscribed || isMine ? att.originalname : false
      })
    })

    const count = await Post.find(condition).countDocuments()

    return res.status(200).json({
      posts,
      message: `Все приватные посты девушки: ${modelCheck.name}`,
      length: posts.length,
      totalDocs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllPostsForSubscriber = async (req, res) => {
  try {
    const condition = { userId: id }
    const { page } = req.query
    const limit = 5
    const modelCheck = await User.findById(id)

    if (!modelCheck) {
      return res.status(400).json({ message: 'Девушки не существует' })
    }

    const now = new Date()
    const subscriptionCheck = await Subscription.findOne({
      subscriber: req.user._id,
      model: id,
      ends: { $gte: now }
    })

    if (!subscriptionCheck) {
      return res.status(403).json({
        message:
          'Вы не подписаны на эту девушку. Чтобы видеть ее приватные посты - подпишитесь'
      })
    }

    const posts = await Post.find(condition).sort({ createdAt: -1 }).exec()

    return res.status(200).json({
      posts,
      message: `Все посты девушки: ${modelCheck.name}`,
      length: posts.length
    })
  } catch (e) {
    return handleError(res, e)
  }
}
