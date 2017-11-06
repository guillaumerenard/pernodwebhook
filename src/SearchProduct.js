const Cards = require('./globals/Cards');

let Request;
let url = "";
let title = "";

module.exports = {
    searchProduct: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            data = data.replace(/ /g, '+');
            session[sessionId].FILTER_TYPE = 0;
            Request = require('./RequestConfig').requestProductList(data);
            Request.end(function (res) {
                if (res.error) {
                    reject(res.error);
                }
                let i = 0;
                while (i < res.body['nbHits']) {
                    if (res.body['hits'][i]['size'] !== null && res.body['hits'][i]['size'] !== undefined) {
                        if (res.body['hits'][i]['size']['id'] !== null && res.body['hits'][i]['size']['id'] !== undefined) {
                            session[sessionId].SIZE_ARRAY.push(res.body['hits'][i]['size']['id']);
                        }
                    }
                    i++;
                }
                if (res.body['nbHits'] > 8) {
                    Cards.glProd['data']['facebook']['quick_replies'].unshift(
                        {
                            "content_type": "text",
                            "title": "Filter by size",
                            "payload": "filter by size"
                        }
                    );
                }
                if (res.body['nbHits'] % 9 !== 0) {
                    let rest = (res.body['nbHits'] % 9);
                    if ((session[sessionId].GLOBAL_SEARCH_PRODUCT + rest) === res.body['nbHits']) {
                        session[sessionId].GLOBAL_SEARCH_PAGE += rest;
                    }
                    else if ((session[sessionId].GLOBAL_SEARCH_PRODUCT + rest) < res.body['nbHits']) {
                        session[sessionId].GLOBAL_SEARCH_PAGE += 9;
                    }
                }
                else {
                    session[sessionId].GLOBAL_SEARCH_PAGE += 9;
                }
                while (session[sessionId].GLOBAL_SEARCH_PRODUCT < session[sessionId].GLOBAL_SEARCH_PAGE) {
                    if (res.body['nbHits'] !== 0 && res.body['hits'][session[sessionId].GLOBAL_SEARCH_PRODUCT]['mediaList'][0] !== undefined) {
                        url = res.body['hits'][session[sessionId].GLOBAL_SEARCH_PRODUCT]['mediaList'][0]['urls']['bamArticleFull'];
                    }
                    else {
                        url = "http://tools.expertime.digital/bot/bouteille-manquante.jpg";
                    }
                    if (res.body['nbHits'] !== 0) {
                        title = res.body['hits'][session[sessionId].GLOBAL_SEARCH_PRODUCT]['productName'];
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
                                    "title": `Description`,
                                    "payload": `send details about ${res.body['hits'][session[sessionId].GLOBAL_SEARCH_PRODUCT]['id']}`
                                },
                                {
                                    "type": "postback",
                                    "title": `Buy this product 🛒`,
                                    "payload": `Buy this Product`
                                },
                                {
                                    "type": "postback",
                                    "title": `Other informations`,
                                    "payload": `send informations about ${res.body['hits'][session[sessionId].GLOBAL_SEARCH_PRODUCT]['id']}`
                                }
                            ]
                        }
                    );
                    session[sessionId].GLOBAL_SEARCH_PRODUCT++;
                }
                if (session[sessionId].GLOBAL_SEARCH_PRODUCT < res.body['nbHits']) {
                    Cards.glProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": `Load more`,
                                    "payload": `search more products ${data}`
                                }
                            ]
                        }
                    );
                }
                resolve(Cards.glProd);
            });
        });
    }
}