
require('dotenv').config();
import request from "request";

// env const to use in side functions
let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
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
                            "image_url": "https://bit.ly/imageMenu",
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
                            "image_url": "https://bit.ly/imageOpening",
                            "buttons": [{
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }],
                        },
                        {
                            "title": "Benquest Rooms",
                            "image_url": "https://bit.ly/imageShowRooms",
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
            resolve({value: "Menu Sent!"})
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

// Send Lunch menu
let sendLunchMenu = (sender_psid) => {
    return new Promise((resolve, reject)=>{
        try {
          let response = {
              "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [
                      {
                          "title": "Appetizers",
                        //   "subtitle": "We are please to offer you the a wide-range of menu for lunch and dinner.",
                          "image_url": "https://bit.ly/imageAppetizer",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW APPETIZERS",
                              "payload": "SHOW_APPETIZERS",
                          }],
                      },
                      {
                          "title": "Entree Salad",
                          "image_url": "https://bit.ly/imageSalad",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW ENTREE SALAD",
                              "payload": "SHOW_ENTREE_SALAD",
                          }],
                      },
                      {
                          "title": "Fish and Shell Fish",
                          "subtitle": "Dry -aged on premise",
                          "image_url": "https://bit.ly/imageFish",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW FISH",
                              "payload": "SHOW_FISH",
                          }],
                      },
                      {
                        "title": "Go Back",
                        "image_url": "https://bit.ly/imageShowRooms",
                        "buttons": [{
                            "type": "postback",
                            "title": "GO TO MAIN MENU",
                            "payload": "GO_TO_MAIN_MENU",
                        }],
                     }
                    ]
                  }
              }
          }
          sendMessage(sender_psid, response);
          resolve({value: "Lunch Menu Sent!"});
        } catch (error) {
            reject(error);
        }
    });
}

// Send Dinner menu
let sendDinnerMenu = (sender_psid) => {
    return new Promise((resolve, reject)=>{
        try {
          let response = {
              "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [
                      {
                          "title": "Appetizers",
                        //   "subtitle": "We are please to offer you the a wide-range of menu for lunch and dinner.",
                          "image_url": "https://bit.ly/imageMenu",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW APPETIZERS",
                              "payload": "SHOW_APPETIZERS",
                          }],
                      },
                      {
                          "title": "Entree Salad",
                          "image_url": "https://bit.ly/imageOpening",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW ENTREE SALAD",
                              "payload": "SHOW_ENTREE_SALAD",
                          }],
                      },
                      {
                          "title": "Fish and Shell Fish",
                          "subtitle": "Dry -aged on premise",
                          "image_url": "https://bit.ly/imageShowRooms",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW FISH",
                              "payload": "SHOW_FISH",
                          }],
                      },{
                        "title": "Go Back",
                        "image_url": "https://bit.ly/imageShowRooms",
                        "buttons": [{
                            "type": "postback",
                            "title": "GO TO MAIN MENU",
                            "payload": "GO_TO_MAIN_MENU",
                        }],
                    }
                    ]
                  }
              }
          }
          sendMessage(sender_psid, response);
          resolve({value: "Lunch Menu Sent!"});
        } catch (error) {
            reject(error);
        }
    });
}

// Send Pub menu
let sendPubMenu = (sender_psid) => {
    return new Promise((resolve, reject)=>{
        try {
          let response = {
              "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [
                      {
                          "title": "Appetizers",
                        //   "subtitle": "We are please to offer you the a wide-range of menu for lunch and dinner.",
                          "image_url": "https://bit.ly/imageMenu",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW APPETIZERS",
                              "payload": "SHOW_APPETIZERS",
                          }],
                      },
                      {
                          "title": "Entree Salad",
                          "image_url": "https://bit.ly/imageOpening",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW ENTREE SALAD",
                              "payload": "SHOW_ENTREE_SALAD",
                          }],
                      },
                      {
                          "title": "Fish and Shell Fish",
                          "subtitle": "Dry -aged on premise",
                          "image_url": "https://bit.ly/imageShowRooms",
                          "buttons": [{
                              "type": "postback",
                              "title": "SHOW FISH",
                              "payload": "SHOW_FISH",
                          }],
                      },{
                        "title": "Go Back",
                        "image_url": "https://bit.ly/imageShowRooms",
                        "buttons": [{
                            "type": "postback",
                            "title": "GO TO MAIN MENU",
                            "payload": "GO_TO_MAIN_MENU",
                        }],
                    }
                    ]
                  }
              }
          }
          sendMessage(sender_psid, response);
          resolve({value: "Lunch Menu Sent!"});
        } catch (error) {
            reject(error);
        }
    });
}
// send Appetizer
let sendAppetizer = (sender_psid) => {
    return new Promise((resolve, reject)=>{
        try {
        let response = {
            "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [
                    {
                        "title": "Little Neck Clams on the Half Shell",
                        "subtitle": "Dozen - $20.00",
                        "image_url": "https://bit.ly/imageAppetizer",
                    },
                    {
                        "title": "Fresh Oysters",
                        "subtitle": "1/2 Dozen - $21.00 | Dozen - $40.00",
                        "image_url": "https://bit.ly/imageSalad",
                    },
                    {
                        "title": "Lobster Salad",
                        "subtitle": "Half Lobster with Avocado and Grapefruit",
                        "image_url": "https://bit.ly/imageFish",
                    },
                    {
                        "title": "Go Back",
                        "image_url": "https://bit.ly/imageShowRooms",
                        "buttons": [{
                            "type": "postback",
                            "title": "BACK TO LUNCH MENU",
                            "payload": "BACK_TO_LUNCH_MENU",
                        },{
                            "type": "postback",
                            "title": "GO TO MAIN MENU",
                            "payload": "GO_TO_MAIN_MENU",
                        }],
                    }
                  ]
                }
            }
        }
        sendMessage(sender_psid, response);
        //   console.log("=>>>>>>>>>>>", response);
        //   sendMessage(sender_psid, response);
          resolve({value: "Appetizer Sent!"});
        } catch (error) {
            reject(error);
        }
    });
}
// send Back To Menu
let handleReserveTable = (sender_psid) => {
    return new Promise( async (resolve, reject)=>{
        try {
            let username = await getFacebookUsername(sender_psid);
            let response = { 
                text: `Hi ${username}, What time and date you would like to reserve a table ?`
            }
            sendMessage(sender_psid, response);
        } catch (error) {
            reject(error);
        }
    })
}

let sendMessageAskingQuality = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient":{
            "id": sender_psid
          },
          "messaging_type": "RESPONSE",
          "message":{
            "text": "What is your party size ?",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"1-2",
                "payload":"SMALL",
              },{
                "content_type":"text",
                "title":"2-5",
                "payload":"MEDIUM",
              },{
                "content_type":"text",
                "title":"More then 5",
                "payload":"LARGE",
              }
            ]
          }
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

let sendMessageAskingPhoneNumber = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient":{
            "id": sender_psid
          },
          "messaging_type": "RESPONSE",
          "message":{
            "text": "Thank you. And what's the best phone number for us to reach you at?",
            "quick_replies":[
              {
                "content_type": "user_phone_number"
              }
            ]
          }
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

let sendMessageDoneReserveTable = async (sender_psid) => {
    try {
        let response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://bit.ly/giftDonalTrump"
                }
            }
        }
        sendMessage(sender_psid, response);
        // get facebook username
        let username = await getFacebookUsername(sender_psid);
        // send another message
        let response2 = {
            "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": `Done! \nOur reservation team will contact you as soon as possible ${username}\n \nWould you like to check our Main Menu?`,
                    "buttons": [
                      {
                        "type": "postback",
                        "title": "SHOW MAIN MENU",
                        "payload": "MAIN_MENU",
                      },
                      {
                        "type": "phone_number",
                        "title": "HOT LINE",
                        "payload": "+911911",
                      }
                    ]
                }
            }
        }
        sendMessage(sender_psid, response2);
    } catch (error) {
        console.log(error);
    }
}

let sendnotificationToTelegram = async (sender_psid) => {
    return new Promise((resolve, reject)=>{
        try {
            let request_body = {
                chat_id: process.env.TELEGRAM_GROUP_ID,
                parse_mode: "HTML",
                text: `
                |---<b>A new reservetion</b> ---|
                |-------------------------------------|
                | 1. Username: <b>${use.name}</b> |
                | 1. Phone number: <b>${use.phoneNumber}</b> |
                | 1. Time: <b>${use.time}</b> |
                | 1. Quantity: <b>${use.quantity}</b> |
                | 1. Created at: <b>${use.createdAt}</b> |
                |-------------------------------------|`
            }
            request({
                "uri": `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                "method": "POST",
                "json": request_body
            },(err, res, boby) => {
                if (!err) {
                    resolve({value: 'Done!'})
                } else {
                    reject({reason: "Unable to send message:" + err});
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getFacebookUsername,
    sendResWelcomeNewCostomer,
    sendMainMenu,
    sendLunchMenu,
    sendDinnerMenu,
    sendPubMenu,
    sendAppetizer,
    handleReserveTable,
    sendMessageAskingQuality,
    sendMessageAskingPhoneNumber,
    sendMessageDoneReserveTable,
    sendnotificationToTelegram
}