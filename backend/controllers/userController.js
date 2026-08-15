import User from '../models/User.js'

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body
    if (name) req.user.name = name
    if (avatar !== undefined) req.user.avatar = avatar
    await req.user.save()
    res.json({ user: req.user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}

export const switchRole = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      res.status(403)
      throw new Error('Admin cannot switch roles')
    }

    const role = req.body.role
    if (!['guest', 'host'].includes(role)) {
      res.status(400)
      throw new Error('You can only switch between guest and host')
    }

    req.user.role = role
    await req.user.save()
    res.json({ user: req.user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}

export const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ users: users.map((user) => user.toSafeObject()) })
  } catch (error) {
    next(error)
  }
}

export const setUserRole = async (req, res, next) => {
  try {
    const { role } = req.body
    if (!['guest', 'host', 'admin'].includes(role)) {
      res.status(400)
      throw new Error('Role must be guest, host, or admin')
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      res.status(400)
      throw new Error('You cannot remove your own admin role')
    }

    user.role = role
    await user.save()
    res.json({ user: user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}
