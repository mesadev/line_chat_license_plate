const text = (req, res) => {
     res.sendFile('../uploads/doodle1.jpg', { root: __dirname })
     //res.send('Hello Expressjs and router and get controller')
}
module.exports = { text }