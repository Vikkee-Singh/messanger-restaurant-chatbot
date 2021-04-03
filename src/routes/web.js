import express from 'express';
import homepageController from "../controllers/homepageController";
import chatbortController from "../controllers/chatbortController";

let router = express.Router();

let initWebRouter = (app) =>{
    router.get("/", homepageController.getHomePage);
    router.get("/webhook", chatbortController.getWebHook);
    router.post("/webhook", chatbortController.postWebHook);
    router.get("/profile", homepageController.getFacebookUserProfile);
    router.post("/set-up-user-fb-profile", homepageController.setUpUserFacebookProfile);

    return app.use("/", router);
}

module.exports = initWebRouter;