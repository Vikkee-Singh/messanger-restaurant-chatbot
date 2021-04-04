
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

module.exports = {
    getFacebookUsername
}