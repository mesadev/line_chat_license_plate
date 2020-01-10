const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const services = require('./routes/services')
const webhook = require('./routes/webhook')
const fs = require('fs')
const http = require('http')
const https = require('https')

// set express js

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/service', services)
app.use('/webhook', webhook)


// Starting both http & https servers
const privateKey = fs.readFileSync('/etc/letsencrypt/live/mnap.site/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/mnap.site/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/mnap.site/chain.pem', 'utf8')
const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
}
const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80')
})
httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443')
})