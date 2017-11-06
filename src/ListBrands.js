const Cards = require('./globals/Cards');

let Request;
let url = "";
let title = "";

module.exports = {
    listBrands: function (session, sessionId, data, cDetails) {
        return new Promise((resolve, reject) => {
            Request = require('./RequestConfig').requestBrands();
            Request.end(function (res) {
                if (res.error) {
                    reject(res.error);
                }
                session[sessionId].FILTER_TYPE = 2;
                if (res.body['nbHits'] % 9 !== 0) {
                    let rest = (res.body['nbHits'] % 9);
                    if ((session[sessionId].BRAND_INCREMENT + rest) === res.body['nbHits']) {
                        session[sessionId].LOAD_BRANDS_COUNT += rest;
                    }
                    else if ((session[sessionId].BRAND_INCREMENT + rest) < res.body['nbHits']) {
                        session[sessionId].LOAD_BRANDS_COUNT += 9;
                    }
                }
                else {
                    session[sessionId].LOAD_BRANDS_COUNT += 9;
                }
                while (session[sessionId].BRAND_INCREMENT < session[sessionId].LOAD_BRANDS_COUNT) {
                    if (res.body['hits'][session[sessionId].BRAND_INCREMENT]['medias']['logoPrincipal']['damAssetId'] !== null) {
                        if (res.body['hits'][session[sessionId].BRAND_INCREMENT]['medias']['logoPrincipal']['urls']['original'] !== undefined) {
                            url = res.body['hits'][session[sessionId].BRAND_INCREMENT]['medias']['logoPrincipal']['urls']['original'];
                        }
                        else {
                            url = "http://tools.expertime.digital/bot/logopr.jpg";
                        }
                    }
                    Cards.brPayload['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": res.body['hits'][session[sessionId].BRAND_INCREMENT]['label'],
                            "image_url": url,
                            "buttons":
                            [
                                {
                                    "type": "postback",
                                    "title": `Choose ${res.body['hits'][session[sessionId].BRAND_INCREMENT]['label']}`,
                                    "payload": "research in brands " + res.body['hits'][session[sessionId].BRAND_INCREMENT]['id']
                                }
                            ]
                        }
                    );
                    session[sessionId].BRAND_INCREMENT++;
                }
                if (session[sessionId].BRAND_INCREMENT < res.body['nbHits']) {
                    Cards.brPayload['data']['facebook']['attachment']['payload']['elements'].push(
                        {
                            "title": "Load more",
                            "image_url": "http://tools.expertime.digital/bot/load-more.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": `Load more`,
                                    "payload": "Load more brands"
                                }
                            ]
                        }
                    );
                }
                resolve(Cards.brPayload);
            });
        });
    }
}