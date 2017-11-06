const Cards = require('./globals/Cards');

let backToInfo = require('./SendPayload').ProductInfo("This product doesn't contain more details.");
let Request;
let url = "";

module.exports = {
    getInfos: function (session, sessionId, data, cDetails) {
        data = data.replace('send informations about ', '');
        Request = require('./RequestConfig').requestProductId(data);
        return new Promise((resolve, reject) => {
            Request.end(function (res) {
                if (res.body['mediaList'][0] === undefined) {
                    url = "";
                }
                else {
                    url = res.body['mediaList'][0]['urls']['original'];
                }
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
                    resolve(backToInfo);
                }
                session[sessionId].CHECK_NULL = 0;
                session[sessionId].DATA_CHUNK = {
                    size: Size,
                    tips: Tips,
                    ingredients: Ingredient,
                    history: PHistory
                };
                resolve(Cards.pdetails);
            });
        });
    }
}