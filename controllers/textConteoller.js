const text = (req, res) => {
     res.sendFile(__dirname + '../../uploads/doodle.jpg')
     //res.send('Hello Expressjs and router and get controller')
}
module.exports = { text }