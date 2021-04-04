require("dotenv").config();
import request from "request";
let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
import homepageService from "../services/homepageService";
let getHomePage = (req, res)=>{
    return res.render("homepage.ejs")
}
let getFacebookUserProfile = (req, res) => {
    return res.render("profile.ejs")
}
let setUpUserFacebookProfile = async (req, res) => {
    // let data = {
    //     "get_started":{
    //         "payload": "GET_STARTED"
    //     },
    //     "persistent_menu": [
    //         {
    //             "locale": "default",
    //             "composer_input_disabled": false,
    //             "call_to_actions": [
    //                 {
    //                     "type": "postback",
    //                     "title": "Talk to an agent",
    //                     "payload": "CARE_HELP"
    //                 },
    //                 {
    //                     "type": "postback",
    //                     "title": "Outfit suggestions",
    //                     "payload": "CURATION"
    //                 },
    //                 {
    //                     "type": "web_url",
    //                     "title": "Shop now",
    //                     "url": "https://www.originalcoastclothing.com/",
    //                     "webview_height_ratio": "full"
    //                 }
    //             ]
    //         }
    //     ],
    //     "whitelisted_domains":[
    //         "https://messager-restaurent-chatbot.herokuapp.com/"
    //     ]
    // };
    // // Send the HTTP request to the Messenger Platform
    // request({
    //     "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
    //     "qs": { "access_token": PAGE_ACCESS_TOKEN },
    //     "method": "POST",
    //     "json": data
    // }, (err, resp, body) => {
    //     if (!err) {
    //         res.status(200).json({
    //             message: "setUp done!"
    //         })
    //     } else {
    //         res.status(500).json({
    //             message: "error form node server"
    //         })
    //     }
    // });

    try {
        await homepageService.setUpMessengerPlatform(PAGE_ACCESS_TOKEN);
        res.status(200).json({
            message: "Ok"
        });
    } catch (error) {
        res.status(500).json({
            message: "error form node server"
        })
    }

    // return res.status(200).json({
    //     message: "Ok"
    // })
}
module.exports = {
    getHomePage,
    getFacebookUserProfile,
    setUpUserFacebookProfile
}