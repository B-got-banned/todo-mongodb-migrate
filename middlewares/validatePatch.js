const Joi = require('joi')
const validatePatch = (req, res, next) => {
  const pattern = Joi.object({
    task: Joi.string().min(3),
    completed: Joi.boolean().required()
  })

  const {error} = pattern.validate(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})
  
  next()
}

module.exports = validatePatch