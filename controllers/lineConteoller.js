const request = require('request')

module.exports.test = async (req, res) => {
    let a = await test()
    res.sendStatus(200)
    return await res.send(a)
}

module.exports.webhook = async (req, res) => {
    try {
        let reply_token = req.body.events[0].replyToken
        let text = req.body.events[0].message.text
        let type = req.body.events[0].message.type
        let imageid = req.body.events[0].message.id
        if (text == 'สนใจสินเชื่อ') {
            await credit(reply_token)
        }
    } catch (error) {
        console.log(error)
    }
    return await res.sendStatus(200)
}

async function credit(reply_token) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+ KwkbwNrwdB04t89 / 1O/ w1cDnyilFU=}'
    }
    let data = JSON.stringify({
        replyToken: reply_token,
        "messages": [
            {
                "type": "text",
                "text": "สามารถถ่ายรูป หรือ เลือกภาพจาก แกลลอรี่ เพื่อประเมินราคารถแบบคร่าวๆ",
                "quickReply": {
                    "items": [
                        {
                            "type": "action",
                            "action": {
                                "type": "camera",
                                "label": "กดเพื่อถ่ายภาพแล้วส่ง"
                            }
                        },
                        {
                            "type": "action",
                            "action": {
                                "type": "cameraRoll",
                                "label": "กดเพื่อเลือกภาพ"
                            }
                        }
                    ]
                }
            }
        ]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: data
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}


async function test(reply_token) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+ KwkbwNrwdB04t89 / 1O/ w1cDnyilFU=}'
    }
    let data = JSON.stringify({
        replyToken: reply_token,
        "messages": [
            {
                "type": "text",
                "text": "ชื่อ อาร์ม ชัยอรุณดีกุล \n เลขบัตรประชาชน 3 1016 00731 97 3 \n ที่อยู่ 80/49 ซ.อ่อนนุช 53 แขวงประเวศ เขตประเวช กรุงเทพมหานคร"
            }
        ]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: data
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}