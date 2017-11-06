const Cards = require('./globals/Cards');

let Request;
let url = "";
let title = "";

module.exports = {
    searchCategoryProduct: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            data = data.replace('research in category ', '');
            data = data.replace('search more categories ', '');
            data = data.replace(/ /g, '+');
            session[sessionId].RETAINED_CATEGORY_VALUE = data;
            Request = require('./RequestConfig').requestProductByCategory(data);
            Request.end(function (res) {
                if (res.error) {
                    reject(res.error);
                }
                session[sessionId].FILTER_TYPE = 1;
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
                    Cards.caProd['data']['facebook']['quick_replies'].unshift(
                        {
                            "content_type": "text",
                            "title": "Filter by size",
                            "payload": "filter by size"
                        }
                    );
                }
                if (res.body['nbHits'] % 9 !== 0) {
                    let rest = (res.body['nbHits'] % 9);
                    if ((session[sessionId].CATEGORY_PRODUCTS + rest) === res.body['nbHits']) {
                        session[sessionId].CATEGORY_PRODUCTS_COUNT += rest;
                    }
                    else if ((session[sessionId].CATEGORY_PRODUCTS + rest) < res.body['nbHits']) {
                        session[sessionId].CATEGORY_PRODUCTS_COUNT += 9;
                    }
                }
                else {
                    session[sessionId].CATEGORY_PRODUCTS_COUNT += 9;
                }
                while (session[sessionId].CATEGORY_PRODUCTS < session[sessionId].CATEGORY_PRODUCTS_COUNT) {
                    if (res.body['nbHits'] !== 0 && res.body['hits'][session[sessionId].CATEGORY_PRODUCTS]['mediaList'][0] !== undefined) {
                        url = res.body['hits'][session[sessionId].CATEGORY_PRODUCTS]['mediaList'][0]['urls']['original'];
                    }
                    else {
                        url = "http://tools.expertime.digital/bot/bouteille-manquante.jpg";
                    }
                    if (res.body['nbHits'] !== 0) {
                        title = res.body['hits'][session[sessionId].CATEGORY_PRODUCTS]['productName'];
                    }
                    else {
                        title = "No products found.";
                    }
                    Cards.caProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": title,
                            "image_url": url,
                            "buttons":
                            [
                                {
                                    "type": "postback",
                                    "title": `Description`,
                                    "payload": `send details about ${res.body['hits'][session[sessionId].CATEGORY_PRODUCTS]['id']}`
                                },
                                {
                                    "type": "postback",
                                    "title": `Buy this product 🛒`,
                                    "payload": `Buy this product`
                                },
                                {
                                    "type": "postback",
                                    "title": `Other informations`,
                                    "payload": `send informations about ${res.body['hits'][session[sessionId].CATEGORY_PRODUCTS]['id']}`
                                }
                            ]
                        }
                    );
                    session[sessionId].CATEGORY_PRODUCTS++;
                }
                if (session[sessionId].CATEGORY_PRODUCTS < res.body['nbHits']) {
                    Cards.caProd['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Load more",
                                    "payload": `search more categories ${data}`
                                }
                            ]
                        }
                    );
                }
                resolve(Cards.caProd);
            });
        });
    }
}