import request from "request";

let setUpMessengerPlatform = (PAGE_ACCESS_TOKEN) => {
    return new Promise((resolve, reject)=>{
        try {
            let data = {
                "get_started":{
                    "payload": "GET_STARTED"
                },
                "persistent_menu": [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            {
                                "type": "postback",
                                "title": "Talk to an agent",
                                "payload": "CARE_HELP"
                            },
                            {
                                "type": "postback",
                                "title": "Outfit suggestions",
                                "payload": "CURATION"
                            },
                            {
                                "type": "web_url",
                                "title": "Shop now",
                                "url": "https://www.originalcoastclothing.com/",
                                "webview_height_ratio": "full"
                            }
                        ]
                    }
                ],
                "whitelisted_domains":[
                    "https://messager-restaurent-chatbot.herokuapp.com/"
                ]
            };
            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": data
            }, (err, resp, body) => {
                if (!err) {
                    // res.status(200).json({
                    //     message: "setUp done!"
                    // })
                    resolve({value: "setUp done!"})
                } else {
                    reject(err);
                    // res.status(500).json({
                    //     message: "error form node server"
                    // })
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    setUpMessengerPlatform
}

