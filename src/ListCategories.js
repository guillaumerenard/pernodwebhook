const Cards = require('./globals/Cards');
const Img = require('./links');

let Request;
let url = "";
let title = "";

module.exports = {
    listCategories: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            Request = require('./RequestConfig').requestCategories();
            Request.end(function (res) {
                if (res.error) {
                    reject(res.error);
                }
                session[sessionId].FILTER_TYPE = 1;
                if (res.body['nbHits'] % 9 !== 0) {
                    let rest = (res.body['nbHits'] % 9);
                    if ((session[sessionId].CATEGORIES_INCREMENT + rest) === res.body['nbHits']) {
                        session[sessionId].LOAD_CATEGORIES_COUNT += rest;
                    }
                    else if ((session[sessionId].CATEGORIES_INCREMENT + rest) < res.body['nbHits']) {
                        session[sessionId].LOAD_CATEGORIES_COUNT += 9;
                    }
                }
                else {
                    session[sessionId].LOAD_CATEGORIES_COUNT += 9;
                }
                while (session[sessionId].CATEGORIES_INCREMENT < session[sessionId].LOAD_CATEGORIES_COUNT) {
                    url = Img.getCategoryImg(res.body['hits'][session[sessionId].CATEGORIES_INCREMENT]['label']);
                    Cards.caPayload['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": res.body['hits'][session[sessionId].CATEGORIES_INCREMENT]['label'],
                            "image_url": url,
                            "buttons":
                            [
                                {
                                    "type": "postback",
                                    "title": `Choose ${res.body['hits'][session[sessionId].CATEGORIES_INCREMENT]['label']}`,
                                    "payload": "research in category " + res.body['hits'][session[sessionId].CATEGORIES_INCREMENT]['id']
                                }
                            ]
                        }
                    );
                    session[sessionId].CATEGORIES_INCREMENT++;
                }
                if (session[sessionId].CATEGORIES_INCREMENT < res.body['nbHits']) {
                    Cards.caPayload['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": `Load more`,
                                    "payload": "Load more categories"
                                }
                            ]
                        }
                    );
                }
                resolve(Cards.caPayload);
            });
        });
    }
}