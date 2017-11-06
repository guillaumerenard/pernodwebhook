const Cards = require('./globals/Cards');

let Request;
let url = "";
let title = "";

module.exports = {
    GetSizes: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            session[sessionId].SIZE_ARRAY = new Set(session[sessionId].SIZE_ARRAY); // remove duplicates
            session[sessionId].SIZE_ARRAY = Array.from(session[sessionId].SIZE_ARRAY); // Reset to array
            session[sessionId].SIZE_ARRAY.sort(function (a, b) { return a - b }); // Sort by ascending order
            if (session[sessionId].SIZE_ARRAY.length % 9 !== 0) {
                let rest = session[sessionId].SIZE_ARRAY.length % 9;
                if (session[sessionId].PRODUCT_SIZE_VALUE + rest === session[sessionId].SIZE_ARRAY.length) {
                    session[sessionId].PRODUCT_SIZE_PAGE += rest;
                }
                else if (session[sessionId].PRODUCT_SIZE_VALUE + rest < session[sessionId].SIZE_ARRAY.length) {
                    session[sessionId].PRODUCT_SIZE_PAGE += 9;
                }
            }
            else {
                session[sessionId].PRODUCT_SIZE_PAGE += 9;
            }
            while (session[sessionId].PRODUCT_SIZE_VALUE < session[sessionId].PRODUCT_SIZE_PAGE) {
                Cards.psize['messages'][0]['replies'].push(
                    session[sessionId].SIZE_ARRAY[session[sessionId].PRODUCT_SIZE_VALUE]
                );
                session[sessionId].PRODUCT_SIZE_VALUE++;
            }
            if (session[sessionId].SIZE_ARRAY.length > 9 && session[sessionId].PRODUCT_SIZE_VALUE < session[sessionId].SIZE_ARRAY.length) {
                Cards.psize['messages'][0]['replies'].push("more sizes");
            }
            resolve(Cards.psize);
        });
    },

    GetProductsPerSize: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            if (session[sessionId].FILTER_TYPE === 1) {
                Request = require('./RequestConfig').requestProductByCategory(session[sessionId].RETAINED_CATEGORY_VALUE);
            }
            else if (session[sessionId].FILTER_TYPE === 2) {
                Request = require('./RequestConfig').requestProductByBrand(session[sessionId].RETAINED_BRAND_VALUE);
            }
            else {
                data = data.replace(/ /g, '+');
                Request = require('./RequestConfig').requestProductList(data);
            }
            Request.end(function (res) {
                if (res.error) {
                    reject(res.error);
                }
                let amount = 0;
                for (let t = 0; t < res.body['nbHits']; t++) {
                    if (res.body['hits'][t]['size'] !== null && res.body['hits'][t]['size'] !== undefined) {
                        if (res.body['hits'][t]['size']['id'] !== null && res.body['hits'][t]['size']['id'] !== undefined) {
                            if (res.body['hits'][t]['size']['id'] === session[sessionId].WANTED_SIZE) {
                                amount++;
                            }
                        }
                    }
                }
                if (res.body['nbHits'] % 9 !== 0) {
                    let rest = res.body['nbHits'] % 9;
                    if ((session[sessionId].WANTED_PRODUCT_VALUE + rest) === res.body['nbHits']) {
                        session[sessionId].WANTED_PRODUCT_PAGE += rest;
                    }
                    else if ((session[sessionId].WANTED_PRODUCT_VALUE + rest) < res.body['nbHits']) {
                        session[sessionId].WANTED_PRODUCT_PAGE += 9;
                    }
                }
                else {
                    session[sessionId].WANTED_PRODUCT_PAGE += 9;
                }
                while (session[sessionId].WANTED_PRODUCT_VALUE < session[sessionId].WANTED_PRODUCT_PAGE) {
                    if (res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['size'] !== null && res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['size'] !== undefined) {
                        if (res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['size']['id'] !== null && res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['size']['id'] !== undefined) {
                            if (res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['size']['id'] === session[sessionId].WANTED_SIZE) {
                                if (res.body['nbHits'] !== 0 && res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['mediaList'][0] !== undefined) {
                                    url = res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['mediaList'][0]['urls']['bamArticleFull'];
                                }
                                else {
                                    url = "http://tools.expertime.digital/bot/bouteille-manquante.jpg";
                                }
                                if (res.body['nbHits'] !== 0) {
                                    title = res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['productName'];
                                }
                                else {
                                    title = "No products found.";
                                }
                                Cards.glProd['data']['facebook']['attachment']['payload']['elements'].push(
                                    {
                                        "title": title,
                                        "image_url": url,
                                        "buttons":
                                        [
                                            {
                                                "type": "postback",
                                                "title": "Description",
                                                "payload": `send details about ${res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['id']}`
                                            },
                                            {
                                                "type": "postback",
                                                "title": `Buy this product 🛒`,
                                                "payload": `Buy this product`
                                            },
                                            {
                                                "type": "postback",
                                                "title": "Other Informations",
                                                "payload": `send informations about ${res.body['hits'][session[sessionId].WANTED_PRODUCT_VALUE]['id']}`
                                            },
                                        ]
                                    }
                                );
                                session[sessionId].CURRENT_CARD_COUNT += 1;
                            }
                            else {
                                if (session[sessionId].WANTED_PRODUCT_PAGE < res.body['nbHits']) {
                                    session[sessionId].WANTED_PRODUCT_PAGE += 1;
                                }
                            }
                        }
                        else {
                            if (session[sessionId].WANTED_PRODUCT_PAGE < res.body['nbHits']) {
                                session[sessionId].WANTED_PRODUCT_PAGE += 1;
                            }
                        }
                    }
                    else {
                        if (session[sessionId].WANTED_PRODUCT_PAGE < res.body['nbHits']) {
                            session[sessionId].WANTED_PRODUCT_PAGE += 1;
                        }
                    }
                    session[sessionId].WANTED_PRODUCT_VALUE++;
                }
                if (session[sessionId].CURRENT_CARD_COUNT < amount) {
                    Cards.glProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": `Load more`,
                                    "payload": session[sessionId].WANTED_SIZE
                                }
                            ]
                        }
                    );
                }
                resolve(Cards.glProd);
            });
        });
    }
};