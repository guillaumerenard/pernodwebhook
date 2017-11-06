const MSG_TYPE_TEXT = 0;
const MSG_TYPE_QUICK_REPLY = 2;
const MSG_TYPE_IMG = 3;

module.exports = {
    genericTemplate: function () {
        return {
            'data': {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": []
                        }
                    }
                }
            }
        };
    },

    qRepTemplate: function (type) {
        if (!type) {
            type = "Filters";
        }
        return {
            'data': {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": []
                        }
                    },
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": `Back to ${type} 🔙`,
                            "payload": type
                        }
                    ]
                }
            }
        };
    },

    ProductQuestion: function (imageUrl, desc) {
        return {
            "messages": [
                {
                    "type": MSG_TYPE_IMG,
                    "imageUrl": imageUrl,
                    "platform": "facebook"
                },
                {
                    "type": MSG_TYPE_TEXT,
                    "speech": desc,
                    "platform": "facebook"
                },
                {
                    "type": MSG_TYPE_QUICK_REPLY,
                    "title": "What do you want to do ?",
                    "replies": [
                        "Buy this product 🛒",
                        "More details",
                        "Back to filters 🔙"
                    ],
                    "platform": "facebook"
                }
            ]
        };
    },

    ProductDetails: function () {
        return {
            "messages": [
                {
                    "type": MSG_TYPE_QUICK_REPLY,
                    "title": "Want to know more about",
                    "replies": [],
                    "platform": "facebook"
                }
            ]
        };
    },

    ProductInfo: function (msg) {
        return {
            "messages": [
                {
                    "type": MSG_TYPE_TEXT,
                    "speech": msg,
                    "platform": "facebook"
                },
                {
                    "type": MSG_TYPE_QUICK_REPLY,
                    "title": "What do you want to do ?",
                    "replies": [
                        "Buy this product 🛒",
                        "More details",
                        "Back to filters 🔙"
                    ],
                    "platform": "facebook"
                }
            ]
        };
    },

    StartReply: function () {
        return {
            "messages": [
                {
                    "type": MSG_TYPE_TEXT,
                    "speech": "Hello and welcome in the Pernod Ricard's catalog of products.",
                    "platform": "facebook"
                },
                {
                    "type": MSG_TYPE_QUICK_REPLY,
                    "title": "You can find products using the buttons below or simply typing the name of the product.",
                    "replies": [
                        "Brands 🍾",
                        "Categories 🍸"
                    ],
                    "platform": "facebook"
                }
            ]
        };
    },

    filterReply: function () {
        return {
            "messages": [
                {
                    "type": MSG_TYPE_QUICK_REPLY,
                    "title": "You can find products using the buttons below or simply typing the name of the product.",
                    "replies": [
                        "Brands 🍾",
                        "Categories 🍸"
                    ],
                    "platform": "facebook"
                }
            ]
        };
    },

    ProductSize: function () {
        return {
            "messages": [
                {
                    "type": MSG_TYPE_QUICK_REPLY,
                    "title": "Choose a Size",
                    "replies": [],
                    "platform": "facebook"
                }
            ]
        };
    },

    WebView: function () {
        return {
            'data': {
                "facebook":
                {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [
                                {
                                    "title": "Welcome to barpremium",
                                    "image_url": "http://levendangeur.fr/wp-content/uploads/2016/06/bar-premium.png",
                                    "subtitle": "Find the products you want !",
                                    "default_action": {
                                        "type": "web_url",
                                        "url": "https://www.barpremium.com/barpremium/",
                                        "messenger_extensions": true,
                                        "webview_height_ratio": "tall",
                                        "fallback_url": "https://www.barpremium.com/"
                                    },
                                    "buttons": [
                                        {
                                            "type": "web_url",
                                            "url": "https://www.barpremium.com/barpremium/",
                                            "title": "Access Website"
                                        }
                                    ]
                                },
                                {
                                    "title": "Welcome to Auchan",
                                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Logo_Auchan_2015.jpg",
                                    "subtitle": "Find the products you want !",
                                    "default_action": {
                                        "type": "web_url",
                                        "url": "https://www.auchan.fr/mumm-champagne-mumm-brut-cordon-rouge/p-c395487%3bjsessionid=6CC0CE5CFCE957F5D0994D20BD13DA41-n2?utm_source=Pernod-Ricard&utm_medium=brandwebsite&utm_campaign=Pernod%20Ricard%20ClickToBuy%20Solution",
                                        "messenger_extensions": true,
                                        "webview_height_ratio": "tall",
                                        "fallback_url": "https://www.barpremium.com/"
                                    },
                                    "buttons": [
                                        {
                                            "type": "web_url",
                                            "url": "https://www.auchan.fr/mumm-champagne-mumm-brut-cordon-rouge/p-c395487%3bjsessionid=6CC0CE5CFCE957F5D0994D20BD13DA41-n2?utm_source=Pernod-Ricard&utm_medium=brandwebsite&utm_campaign=Pernod%20Ricard%20ClickToBuy%20Solution",
                                            "title": "Access Website"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        };
    }
};