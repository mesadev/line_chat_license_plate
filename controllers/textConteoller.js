const text = (req, res) => {
     res.sendFile('./doodle.jpg', { root: __dirname })
     //res.send('Hello Expressjs and router and get controller')
}
module.exports = { text }