module.exports.text = async (req, res) => {
     res.sendFile('./doodle1.jpg', { root: __dirname })
}
