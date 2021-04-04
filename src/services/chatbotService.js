
require('dotenv').config();
import request from "request";

// env const to use in side functions
let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
  
  let getFacebookUsername = (sender_psid) => {
    //   curl -X GET "https://graph.facebook.com/<PSID>?fields=first_name,last_name,profile_pic&access_token=<PAGE_ACCESS_TOKEN>"
    let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`
    return new Promise((resolve, reject)=>{
            request({
                "uri": uri,
                "method": "GET",
              }, (err, res, body) => {
                if (!err) {
                    body = JSON.parse(body);
                    resolve(`${body.first_name} ${body.last_name}`);
                } else {
                    reject({reason: `Unable to send message:` + err});
                }
            });
    });

  }

  let sendResWelcomeNewCostomer = (username, sender_psid) => {
      return new Promise((resolve,reject)=>{
        let response_first = { "text": `Welcome ${username} to Vikkee Singh's Restaurent!` }
        let response_secound = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Vikkkee's Restaurent",
                  "image_url": "https://bit.ly/imageToSend",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Main Menu",
                      "payload": "MENU",
                    }
                  ],
                }]
              }
            }
        }

        await sendMessage(sender_psid, response_first);
        await sendMessage(sender_psid, response_secound);
      })
  }

  // Sends response messages via the Send API
let sendMessage = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  
    // Send the HTTP request to the Messenger Platform
    return new Promise((resolve, reject)=>{
        request({
          "uri": "https://graph.facebook.com/v6.0/me/messages",
          "qs": { "access_token": PAGE_ACCESS_TOKEN },
          "method": "POST",
          "json": request_body
        }, (err, res, body) => {
          if (!err) {
              console.log('message sent!')
              resolve(true);
          } else {
              console.error("Unable to send message:" + err);
              reject(false)
          }
        }); 
    })

  }

module.exports = {
    getFacebookUsername,
    sendResWelcomeNewCostomer
}