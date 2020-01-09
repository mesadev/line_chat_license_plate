module.exports.test = async (req, res) => {
    let a = test()
    return await res.send(a)
}

module.exports.webhook = async (req, res) => {
    try {
        let reply_token = req.body.events[0].replyToken
        let a = await test()
    } catch (error) {
        console.log(error)
    }
    return await res.sendStatus(200)
}

async function test() {
    let b = 0
    for (let index = 0; index < 50; index++) {

        b = b+1
    }
    console.log(b)
    return b
}