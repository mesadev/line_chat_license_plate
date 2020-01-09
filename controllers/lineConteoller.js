module.exports.test = async (req, res) => {
    let a = test()
    return await res.send(a)
}

module.exports.webhook = async (req, res) => {
    try {
        let reply_token = req.body.events[0].replyToken
        let a = test()
    } catch (error) {
        console.log(error)
    }
    return await res.sendStatus(200)
}

function test(){
    return "ddddd"
}