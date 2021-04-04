
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
          try {
            let response_first = { "text": `Welcome ${username} to Vikkee Singh's Restaurent!` }
            let response_secound = {
                "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements": [{
                        "title": "Vikkkee's Restaurent",
                        "subtitle": "My restaurent is legendary, its classic wine collection equally so.",
                        "image_url": "https://bit.ly/imageToSend",
                        "buttons": [
                          {
                            "type": "postback",
                            "title": "SHOW MAIN MENU",
                            "payload": "MAIN_MENU",
                          }
                        ],
                      }]
                    }
                }
            }
              // send welcome message
              sendMessage(sender_psid, response_first);
              // send image with button view Menu
              sendMessage(sender_psid, response_secound);
              
              resolve({value: "Done"})
          } catch (error) {
            reject(error);
          }
      })
  }

  let sendMainMenu = (sender_psid) => {
      return new Promise((resolve, reject)=>{
          try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements": [
                        {
                            "title": "Our menus",
                            "subtitle": "We are please to offer you the a wide-range of menu for lunch and dinner.",
                            "image_url": "https://bit.ly/imageToSend",
                            "buttons": [{
                                "type": "postback",
                                "title": "LUNCH MENU",
                                "payload": "LUNCH_MENU",
                            },{
                                "type": "postback",
                                "title": "DINNER MENU",
                                "payload": "DINNER_MENU",
                            },{
                                "type": "postback",
                                "title": "PUB MENU",
                                "payload": "PUB_MENU",
                            }],
                        },
                        {
                            "title": "Hours",
                            "subtitle": `MON-FRI 10:00AM - 11:00PM
                                        SAT 05:00PM - 10:00PM
                                        SUN 05:00PM - 09:00PM
                            `,
                            "image_url": "https://bit.ly/imageToSend",
                            "buttons": [{
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }],
                        },
                        {
                            "title": "Benquest Rooms",
                            "image_url": "https://bit.ly/imageToSend",
                            "buttons": [{
                                "type": "postback",
                                "title": "SHOW ROOMS",
                                "payload": "SHOW_ROOMS",
                            }],
                        }
                      ]
                    }
                }
            }
            sendMessage(sender_psid, response); 
          } catch (error) {
              reject(error);
          }
      });
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
        request({
          "uri": "https://graph.facebook.com/v6.0/me/messages",
          "qs": { "access_token": PAGE_ACCESS_TOKEN },
          "method": "POST",
          "json": request_body
        }, (err, res, body) => {
          if (!err) {
              console.log('message sent!')
          } else {
              console.error("Unable to send message:" + err);
          }
        }); 
}

module.exports = {
    getFacebookUsername,
    sendResWelcomeNewCostomer,
    sendMainMenu
}