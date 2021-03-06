require('dotenv').config();
import request from "request";
import moment from "moment";
import chatbootService from "../services/chatbotService";
// env const to use in side functions
let MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
let TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID

let user = {
    name: "",
    phoneNumer: "",
    time: "",
    quantity: "",
    createdAt: ""
};
    
let postWebHook = (req, res)=>{// Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

         // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
        
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
};

let getWebHook = (req, res)=>{
    // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED', mode);
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
};

// Handles messages events
let handleMessage = async (sender_psid, message) => {
    // check quick reply
    if (message && message.quick_reply && message.quick_reply.payload) {
        if (message.quick_reply.payload === "SMALL" || message.quick_reply.payload === "MEDIUM" || message.quick_reply.payload === "LARGE") {
            if (message.quick_reply.payload === "SMALL") user.quantity = "1-2 people";
            if (message.quick_reply.payload === "MEDIUM") user.quantity = "2-5 people";
            if (message.quick_reply.payload === "LARGE") user.quantity = "More than 5 people";
            await chatbootService.sendMessageAskingPhoneNumber(sender_psid);
            return;   
        }
        if (message.quick_reply.payload !== " ") {
            user.phoneNumer = message.quick_reply.payload;
            user.createdAt = moment(Date.now()).zone("+05:30").format("MM/DD/YYYY h:mm: A");
            // send a notification to telegram group chat by Telegram bot
            await chatbootService.sendnotificationToTelegram(user);
            // send message to the user
            await chatbootService.sendMessageDoneReserveTable(sender_psid);
        }
        return;   
    }

    // handle text message
    let entity = handleMessageWithEntities(message);

    if (entity.name === "wit$datetime:datetime") {
        user.time = moment(Date.now()).zone("+05:30").format("MM/DD/YYYY h:mm: A");

        // handle quick reply message: 
        await chatbootService.sendMessageAskingQuality(sender_psid);
    } else if (entity.name === "wit$phone_number:phone_number") {
        user.phoneNumer = entity.value;
        user.createdAt = moment(Date.now()).zone("+05:30").format("MM/DD/YYYY h:mm: A");

        // send a notification to telegram group chat by Telegram bot
        await chatbootService.sendnotificationToTelegram(user);

        // handle quick reply message:
        await chatbootService.sendMessageDoneReserveTable(sender_psid);
    } else {
        
    }

    // let response;
  
    // // Check if the message contains text
    // if (received_message.text) {    
  
    //   // Create the payload for a basic text message
    //   response = {
    //     "text": `You sent the message: "${received_message.text}". Now send me an image!`
    //   }
    // } else if (received_message.attachments) {
  
    //     // Gets the URL of the message attachment
    //     let attachment_url = received_message.attachments[0].payload.url;
    //     response = {
    //         "attachment": {
    //           "type": "template",
    //           "payload": {
    //             "template_type": "generic",
    //             "elements": [{
    //               "title": "Is this the right picture?",
    //               "subtitle": "Tap a button to answer.",
    //               "image_url": attachment_url,
    //               "buttons": [
    //                 {
    //                   "type": "postback",
    //                   "title": "Yes!",
    //                   "payload": "yes",
    //                 },
    //                 {
    //                   "type": "postback",
    //                   "title": "No!",
    //                   "payload": "no",
    //                 }
    //               ],
    //             }]
    //           }
    //         }
    //     }
    // }
    
    // // Sends the response message
    // callSendAPI(sender_psid, response);    
}

let handleMessageWithEntities = (message) => {
    let entitesArr  = ["wit$datetime:datetime", "wit$phone_number:phone_number" ];
    let entityChosen = "";
    let data = {};
    entitesArr.forEach(element => {
        let entity = firstEntity(message.nlp, element);
        if(entity && entity.confidence > 0.8) {
            entityChosen = element;
            data.value = entity.value;
        }
    })
    data.name = entityChosen;
    return data;
}

let firstEntity = (nlp, name) => nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
        case "GET_STARTED":
            let username = await chatbootService.getFacebookUsername(sender_psid);
            await chatbootService.sendResWelcomeNewCostomer(username, sender_psid);
            break;
        case "MAIN_MENU":
            await chatbootService.sendMainMenu(sender_psid);
            break;
        case "LUNCH_MENU":
            await chatbootService.sendLunchMenu(sender_psid);
            break;
        case "DINNER_MENU":
            await chatbootService.sendDinnerMenu(sender_psid);
            break;
        case "PUB_MENU":
            await chatbootService.sendPubMenu(sender_psid);
            break;
        case "RESERVE_TABLE":
            await chatbootService.handleReserveTable(sender_psid);
            break;
        case "SHOW_ROOMS":
            response = { }
            break;
        case "SHOW_APPETIZERS":
            await chatbootService.sendAppetizer(sender_psid);
            break;
        case "SHOW_ENTREE_SALAD":
            // await chatbootService.sendAppetizer(sender_psid);
            break;
        case "GO_TO_MAIN_MENU":
            await chatbootService.sendMainMenu(sender_psid);
            break;
        case "BACK_TO_LUNCH_MENU":
            await chatbootService.sendLunchMenu(sender_psid);
            break;
        case "yes":
            response = { "text": "Thanks!" }
            break;
        case "no":
            response = { "text": "Oops, try sending another image." }
            break;
        default:
            console.log("Somthing wrong with switch case payload");
            break;
    }
    // Send the message to acknowledge the postback
    // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
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
    postWebHook,
    getWebHook
}