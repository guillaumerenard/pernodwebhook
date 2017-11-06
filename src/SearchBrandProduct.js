const Cards = require('./globals/Cards');

let Request;
let url = "";
let title = "";

module.exports = {
    searchBrandProduct: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            data = data.replace('research in brands ', '');
            data = data.replace('search more brands ', '');
            data = data.replace(/ /g, '+');
            session[sessionId].RETAINED_BRAND_VALUE = data;
            Request = require('./RequestConfig').requestProductByBrand(data);
            Request.end(function (res) {
                if (res.error) {
                    reject(res.error);
                }
                let k = 0;
                while (k < res.body['nbHits']) {
                    if (res.body['hits'][k]['size'] !== null && res.body['hits'][k]['size'] !== undefined) {
                        if (res.body['hits'][k]['size']['id'] !== null && res.body['hits'][k]['size']['id'] !== undefined) {
                            session[sessionId].SIZE_ARRAY.push(res.body['hits'][k]['size']['id']);
                        }
                    }
                    k++;
                }
                if (res.body['nbHits'] > 8) {
                    Cards.brProd['data']['facebook']['quick_replies'].unshift(
                        {
                            "content_type": "text",
                            "title": "Filter by size",
                            "payload": "filter by size"
                        }
                    );
                }
                if (res.body['nbHits'] % 9 !== 0) {
                    let rest = (res.body['nbHits'] % 9);
                    if ((session[sessionId].BRANDS_PRODUCTS + rest) === res.body['nbHits']) {
                        session[sessionId].BRANDS_PRODUCTS_COUNT += rest;
                    }
                    else if ((session[sessionId].BRANDS_PRODUCTS + rest) < res.body['nbHits']) {
                        session[sessionId].BRANDS_PRODUCTS_COUNT += 9;
                    }
                }
                else {
                    session[sessionId].BRANDS_PRODUCTS_COUNT += 9;
                }
                while (session[sessionId].BRANDS_PRODUCTS < session[sessionId].BRANDS_PRODUCTS_COUNT) {
                    if (res.body['nbHits'] !== 0 && res.body['hits'][session[sessionId].BRANDS_PRODUCTS]['mediaList'][0] !== undefined) {
                        url = res.body['hits'][session[sessionId].BRANDS_PRODUCTS]['mediaList'][0]['urls']['bamArticleFull'];
                    }
                    else {
                        url = "http://tools.expertime.digital/bot/bouteille-manquante.jpg";
                    }
                    if (res.body['nbHits'] !== 0) {
                        title = res.body['hits'][session[sessionId].BRANDS_PRODUCTS]['productName'];
                    }
                    else {
                        title = "No products found.";
                    }
                    Cards.brProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": title,
                            "image_url": url,
                            "buttons":
                            [
                                {
                                    "type": "postback",
                                    "title": `Description`,
                                    "payload": `send details about ${res.body['hits'][session[sessionId].BRANDS_PRODUCTS]['id']}`
                                },
                                {
                                    "type": "postback",
                                    "title": `Buy this product 🛒`,
                                    "payload": `Buy this product`
                                },
                                {
                                    "type": "postback",
                                    "title": `Other informations`,
                                    "payload": `send informations about ${res.body['hits'][session[sessionId].BRANDS_PRODUCTS]['id']}`
                                }
                            ]
                        }
                    );
                    session[sessionId].BRANDS_PRODUCTS++;
                }
                if (session[sessionId].BRANDS_PRODUCTS < res.body['nbHits']) {
                    Cards.brProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Load more",
                                    "payload": `search more brands ${data}`
                                }
                            ]
                        }
                    );
                }
                else if (session[sessionId].BRANDS_PRODUCTS >= res.body['nbHits'] && session[sessionId].RETAINED_CATEGORY_VALUE.length != 0) {
                    Cards.brProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Load more",
                                    "payload": `search more categories ${session[sessionId].RETAINED_CATEGORY_VALUE}`
                                }
                            ]
                        }
                    );
                }
                resolve(Cards.brProd);
            });
        });
    }
}