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
