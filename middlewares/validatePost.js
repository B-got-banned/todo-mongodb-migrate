const Joi = require("joi")
const validatePost = (req, res, next) => {
  const patttern = Joi.object({
    task: Joi.string().min(3).required(),
    completed: Joi.boolean().default(false)
  })

  const {error} = patttern.validate(req.body)
  if(error) return res.status(400).json({error: error.details[0].message})

  next()
}

module.exports = validatePost
