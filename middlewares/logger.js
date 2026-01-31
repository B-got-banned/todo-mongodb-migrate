//Logging middleware for all requests
const logRequest = (req, res, next) => {
  const timeStamp = new Date().toISOString()
  console.log(`${req.method} request to ${req.url} - ${req.ip} on ${timeStamp}`)
  next()
}

module.exports = logRequest