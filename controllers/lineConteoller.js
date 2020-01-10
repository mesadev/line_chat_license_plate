const request = require('request')
const fs = require('fs');
var path = require('path');

let id = false
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
        if (text == 'ประเมินราคารถ') {
            await credit(reply_token)
            id = false
        }
        if (type == 'image' && id == false) {
            await plate(reply_token, imageid)
        }
        if (text == 'สมัครสินเชื่อ') {
            await registry(reply_token)
            id = true
        }
        if (type == 'image' && id == true) {
            await checkid(reply_token, imageid)
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

async function plate(reply_token, imageid) {

    try {
        fs.unlinkSync(path.resolve('uploads/doodle.jpg'))
        //file removed
    } catch (err) {
        console.error(err)
    }

    var options = {
        method: 'GET',
        url: `https://api-data.line.me/v2/bot/message/${imageid}/content`,
        headers:
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Encoding': 'gzip, deflate',
            Host: 'api-data.line.me',
            'Postman-Token': '1a6bdeff-2912-48e3-8e1b-c8b6e684ed61,e6d1973b-82eb-44a0-a348-cee600f7b3ed',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.19.0',
            Authorization: 'Bearer RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+ KwkbwNrwdB04t89 / 1O/ w1cDnyilFU=}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    })
    request
        .get(options)
        .on('error', function (err) {
            console.error(err)
        })
        .pipe(fs.createWriteStream(path.resolve('uploads/doodle.jpg')))
    let data = 'dd'
    request.post('https://api.openalpr.com/v2/recognize_url?recognize_vehicle=1&country=th&secret_key=sk_48d6fdc6d4396542e24da343&return_image=false',
        {
            form: {
                image_url: 'https://mnap.site/service'
            }
        },
        function (err, httpResponse, body) {
            data = JSON.parse(body).results[0]
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+KwkbwNrwdB04t89/1O/w1cDnyilFU=}'
            }
            let body1 = JSON.stringify({
                replyToken: reply_token,
                "messages": [
                    {
                        "type": "text",
                        "text": `เลขทะเบียน : ${JSON.parse(body).results[0].plate} \n ยี่ห้อ : ${data.vehicle.make[0].name}\n รุ่น :
 ${data.vehicle.make_model[0].name} \n ปี : ${data.vehicle.year[0].name} \n สี : ${data.vehicle.color[0].name} \nราคาประเมิน : 400,000 บาท `
                    },
                    {
                        "type": "text",
                        "text": "ทั้งนี้ เป็นราคาประเมินขั้นต้นเท่านั้น หากต้องการทราบราคาที่ถูกต้อง กรุณาติดต่อได้ที่ ..."
                    }
                ]
            })
            request.post({
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: headers,
                body: body1
            }, (err, res, body) => {
                console.log('status = ' + res.statusCode);
            });
        })
}


async function registry(reply_token) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+ KwkbwNrwdB04t89 / 1O/ w1cDnyilFU=}'
    }
    let data = JSON.stringify({
        replyToken: reply_token,
        "messages": [
            {
                "type": "text",
                "text": "สามารถถ่ายรูป หรือ เลือกภาพ บัตรประชาชน จากแกลลอรี่ เพื่อสมัครสินเชื่อ",
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

async function checkid(reply_token, imageid) {
    console.log("ddd")
    try {
        fs.unlinkSync(path.resolve('uploads/image.jpg'))
        //file removed
    } catch (err) {
        console.error(err)
    }
    var options = {
        method: 'GET',
        url: `https://api-data.line.me/v2/bot/message/${imageid}/content`,
        headers:
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Encoding': 'gzip, deflate',
            Host: 'api-data.line.me',
            'Postman-Token': '1a6bdeff-2912-48e3-8e1b-c8b6e684ed61,e6d1973b-82eb-44a0-a348-cee600f7b3ed',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.19.0',
            Authorization: 'Bearer RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+ KwkbwNrwdB04t89 / 1O/ w1cDnyilFU=}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    })
    request
        .get(options)
        .on('error', function (err) {
            console.error(err)
        })
        .pipe(fs.createWriteStream(path.resolve('uploads/image.jpg')))
    console.log("ddd")

    var options = {
        'method': 'POST',
        'url': 'http://203.146.102.46:42006/upload',
        'headers': {
            'Content-Type': 'multipart/form-data; boundary=--------------------------565635026825644983570673'
        },
        formData: {
            'image': {
                'value': fs.createReadStream(path.resolve('uploads/image.jpg')),
                'options': {
                    'filename': path.resolve('uploads/image.jpg'),
                    'contentType': null
                }
            }
        }
    };
    console.log("ddd")

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });

}


async function getImage(imageid) {

    try {
        fs.unlinkSync(path.resolve('uploads/image1.jpg'))
        //file removed
    } catch (err) {
        console.error(err)
    }
    var options = {
        method: 'GET',
        url: `https://api-data.line.me/v2/bot/message/${imageid}/content`,
        headers:
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Encoding': 'gzip, deflate',
            Host: 'api-data.line.me',
            'Postman-Token': '1a6bdeff-2912-48e3-8e1b-c8b6e684ed61,e6d1973b-82eb-44a0-a348-cee600f7b3ed',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.19.0',
            Authorization: 'Bearer RJXgi+nUMla644UWRoqcIfeZ09O2FjFubsDZShAaYfvk38Akxc8RyE6axssB18UNkKx2Vl/ChTMs/jjuHL7KPBZsCARCmUP/qaetCydyujqLObYmQRpdwb4EQue12Xeeipf/TaXwWOAd2+ KwkbwNrwdB04t89 / 1O/ w1cDnyilFU=}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    })
    request
        .get(options)
        .on('error', function (err) {
            console.error(err)
        })
        .pipe(fs.createWriteStream(path.resolve('uploads/image1.jpg')))

}