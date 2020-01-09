module.exports.test = async (req, res) => {
    return await res.send('Hello test')
}

module.exports.webhook = async (req, res) => {
    return await res.send('Hello webhook')
}