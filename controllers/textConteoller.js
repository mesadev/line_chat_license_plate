var path = require('path');

module.exports.text = async (req, res) => {
     res.sendFile(path.resolve('uploads/doodle.jpg'))
}
