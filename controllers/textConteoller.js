var path = require('path');

module.exports.text = async (req, res) => {
     res.sendFile(path.resolve('uploads/doodle.jpg'))
}

module.exports.id = async (req, res) => {
     res.sendFile(path.resolve('uploads/image.jpg'))
}

