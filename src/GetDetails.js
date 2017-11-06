const Cards = require('./globals/Cards');
const ConstDetails = require('./globals/ConstDetails');
let QuestionPayload = require('./SendPayload').ProductQuestion("", "");

let Request;
let url = "";

module.exports = {
    getDetails: function (session, sessionId, data, cDetails) {
        data = data.replace('send details about ', '');
        Request = require('./RequestConfig').requestProductId(data);
        return new Promise((resolve, reject) => {
            Request.end(function (res) {
                switch (cDetails) {
                    case ConstDetails.NONE:
                        if (res.body['mediaList'][0] === undefined) {
                            url = "";
                        }
                        else {
                            url = res.body['mediaList'][0]['urls']['original'];
                        }
                        let desc;
                        if (res.body['description'] === null) {
                            desc = "There is no description available for this product.";
                        }
                        else {
                            desc = res.body['description'];
                        }
                        QuestionPayload = require('./SendPayload').ProductQuestion(url, desc);
                        let Size;
                        let Tips;
                        let Ingredient;
                        let PHistory;
                        if (res.body['size'] === null || res.body['size'] === undefined) {
                            Size = "This product has no size.";
                            session[sessionId].CHECK_NULL += 1;
                        }
                        else {
                            let containsSize = false;
                            Size = res.body['size']['label'];
                            for (let s = 0; s < Cards.pdetails['messages'][0]['replies'].length; s++) {
                                if (Cards.pdetails['messages'][0]['replies'][s] === "Size") {
                                    containsSize = true;
                                }
                            }
                            if (!containsSize) {
                                Cards.pdetails['messages'][0]['replies'].push(
                                    "Size"
                                );
                            }
                        }
                        if (res.body['consumptionTips'] === null || res.body['consumptionTips'] === undefined) {
                            Tips = "This product has no consumption tips.";
                            session[sessionId].CHECK_NULL += 1;
                        }
                        else {
                            let containsTips = false;
                            Tips = res.body['consumptionTips'];
                            for (let s = 0; s < Cards.pdetails['messages'][0]['replies'].length; s++) {
                                if (Cards.pdetails['messages'][0]['replies'][s] === "Consumption Tips") {
                                    containsTips = true;
                                }
                            }
                            if (!containsTips) {
                                Cards.pdetails['messages'][0]['replies'].push(
                                    "Consumption Tips"
                                );
                            }
                        }
                        if (res.body['ingredientList'] === null || res.body['ingredientList'] === undefined) {
                            Ingredient = "This product has no ingredients.";
                            session[sessionId].CHECK_NULL += 1;
                        }
                        else {
                            let containsIngredients = false;
                            Ingredient = res.body['ingredientList'];
                            for (let s = 0; s < Cards.pdetails['messages'][0]['replies'].length; s++) {
                                if (Cards.pdetails['messages'][0]['replies'][s] === "Product Ingredients") {
                                    containsIngredients = true;
                                }
                            }
                            if (!containsIngredients) {
                                Cards.pdetails['messages'][0]['replies'].push(
                                    "Product Ingredients"
                                );
                            }
                        }
                        if (res.body['productHistory'] === null || res.body['productHistory'] === undefined) {
                            PHistory = "This product has no history.";
                            session[sessionId].CHECK_NULL += 1;
                        }
                        else {
                            let containsHistory = false;
                            PHistory = res.body['productHistory'];
                            for (let s = 0; s < Cards.pdetails['messages'][0]['replies'].length; s++) {
                                if (Cards.pdetails['messages'][0]['replies'][s] === "Product History") {
                                    containsHistory = true;
                                }
                            }
                            if (!containsHistory) {
                                Cards.pdetails['messages'][0]['replies'].push(
                                    "Product History"
                                );
                            }
                        }
                        let containsReturn = false;
                        for (let s = 0; s < Cards.pdetails['messages'][0]['replies'].length; s++) {
                            if (Cards.pdetails['messages'][0]['replies'][s] === "Back to filters 🔙") {
                                containsReturn = true;
                            }
                        }
                        if (!containsReturn) {
                            Cards.pdetails['messages'][0]['replies'].push(
                                "Back to filters 🔙"
                            );
                        }
                        if (session[sessionId].CHECK_NULL >= 4) {
                            session[sessionId].CHECK_NULL = 0;
                            resolve(require('./SendPayload').ProductInfo("This product doesn't contain more details."));
                        }
                        session[sessionId].CHECK_NULL = 0;
                        session[sessionId].DATA_CHUNK = {
                            size: Size,
                            tips: Tips,
                            ingredients: Ingredient,
                            history: PHistory
                        };
                        if (res.error) {
                            reject(res.error);
                        }
                        resolve(QuestionPayload);
                        break;
                    case ConstDetails.SIZE:
                        Cards.productPayload = require('./SendPayload').ProductInfo(`The bottle's size is ${session[sessionId].DATA_CHUNK.size}`);
                        resolve(Cards.productPayload);
                        break;
                    case ConstDetails.HISTORY:
                        Cards.productPayload = require('./SendPayload').ProductInfo(`${session[sessionId].DATA_CHUNK.history}`);
                        resolve(Cards.productPayload);
                        break;
                    case ConstDetails.INGREDIENTS:
                        session[sessionId].DATA_CHUNK.ingredients = res.body['ingredientList'];
                        Cards.productPayload = require('./SendPayload').ProductInfo(`${session[sessionId].DATA_CHUNK.ingredients}`);
                        resolve(Cards.productPayload);
                        break;
                    case ConstDetails.TIPS:
                        Cards.productPayload = require('./SendPayload').ProductInfo(`${session[sessionId].DATA_CHUNK.tips}`);
                        resolve(Cards.productPayload);
                        break;
                }
            });
        });
    }
}