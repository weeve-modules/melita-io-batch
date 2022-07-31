const {
  INGRESS_HOST,
  INGRESS_PORT,
  MODULE_NAME,
  EXECUTE_SINGLE_COMMAND,
  SINGLE_COMMAND,
  DEVICE_EUI_LIST,
} = require('./config/config.js')
const express = require('express')
const app = express()
const winston = require('winston')
const expressWinston = require('express-winston')
const { processCommand } = require('./utils/melita')

// initialization
app.use(express.urlencoded({ extended: true }))
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf)
      } catch (e) {
        res.status(400).json({ status: false, message: 'Invalid payload provided.' })
      }
    },
  })
)

// logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      /*
    new winston.transports.File({
        filename: 'logs/melita_io_batch.log'
    })
    */
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false
    }, // optional: allows to skip some log messages based on request and/or response
  })
)
// main post listener
app.post('/', async (req, res) => {
  const json = req.body
  if (!json) {
    return res.status(400).json({ status: false, message: 'Payload structure is not valid.' })
  }
  if (EXECUTE_SINGLE_COMMAND === 'no' && typeof json.command === 'undefined') {
    return res.status(400).json({ status: false, message: 'Command is missing.' })
  }
  if (typeof json.command.params === 'undefined') {
    return res.status(400).json({ status: false, message: 'Parameters are missing.' })
  }
  if (EXECUTE_SINGLE_COMMAND === 'yes' && !SINGLE_COMMAND) {
    return res.status(400).json({ status: false, message: 'Single command not specified.' })
  }
  if (!DEVICE_EUI_LIST) {
    return res.status(400).json({ status: false, message: 'Device list not specified.' })
  }
  const devices = DEVICE_EUI_LIST.split(',')
  if (devices.length === 0) {
    return res.status(400).json({ status: false, message: 'Device list not specified.' })
  }
  const output = []
  let result = false
  for (let i = 0; i < devices.length; i++) {
    json.command.deviceEUI = devices[i]
    if (EXECUTE_SINGLE_COMMAND === 'yes') {
      result = await processCommand(SINGLE_COMMAND, json)
    } else {
      result = await processCommand(json)
    }
    if (result === false) {
      output.push({
        deviceEUI: json.command.deviceEUI,
        status: false,
        message: 'Bad command or Parameters provided.',
      })
    } else if (typeof result.status !== 'undefined' && result.status === false) {
      output.push({
        deviceEUI: json.command.deviceEUI,
        data: result,
      })
    } else {
      output.push({
        deviceEUI: json.command.deviceEUI,
        status: true,
        data: result,
      })
    }
  }
  return res.status(200).json({ status: true, message: 'Payload processed' })
})

// handle exceptions
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const errCode = err.status || 401
  res.status(errCode).send({
    status: false,
    message: err.message,
  })
})

if (require.main === module) {
  app.listen(INGRESS_PORT, INGRESS_HOST, () => {
    console.log(`${MODULE_NAME} listening on ${INGRESS_PORT}`)
  })
}
