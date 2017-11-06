const express = require('express');
const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const bodyParser = require('body-parser');
const payload = require('./src/SendPayload');
const Cards = require('./src/globals/Cards');
const ConstDetails = require('./src/globals/ConstDetails');
let action;

// JSON related variable
let web = require('./src/SendPayload').WebView();

// Session related variables
const Sessions = {};
let endpoint = 0;

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});
server.use(restifyPlugins.bodyParser());
server.post('/api/pernotWebhook', function(req, res) {
    let sessionId;
    //TODO: Set this in a separate file
    Object.keys(Sessions).forEach(s => {
        if (Sessions[s].userSession === req.body.sessionId) {
            sessionId = s;
        }
    });
    if (!sessionId) {
        sessionId = endpoint;
        endpoint++;
        Sessions[sessionId] = {
            // Register user session
            userSession: req.body.sessionId,

            // Data to be pushed, retained
            RETAINED_CATEGORY_VALUE: {},
            RETAINED_BRAND_VALUE: {},
            RETAINED_DETAIL_QUERY: {},
            PRODUCT_TO_FILTER: {},
            RETAINED_PHRASE: {},
            DATA_CHUNK: {},
            SIZE_ARRAY: [],

            // different variables used to push in JSON arrays depending of the requested action
            BRAND_INCREMENT: 0,
            LOAD_BRANDS_COUNT: 0,
            CATEGORIES_INCREMENT: 0,
            LOAD_CATEGORIES_COUNT: 0,
            CATEGORY_PRODUCTS: 0,
            CATEGORY_PRODUCTS_COUNT: 0,
            BRANDS_PRODUCTS: 0,
            BRANDS_PRODUCTS_COUNT: 0,
            GLOBAL_SEARCH_PRODUCT: 0,
            GLOBAL_SEARCH_PAGE: 0,
            PRODUCT_RETAINED_VALUE: 0,
            PRODUCT_SIZE_VALUE: 0,
            PRODUCT_SIZE_PAGE: 0,
            WANTED_SIZE: 0,
            WANTED_PRODUCT_VALUE: 0,
            WANTED_PRODUCT_PAGE: 0,
            CURRENT_CARD_COUNT: 0,
            FILTER_TYPE: 0,
            CHECK_NULL: 0,
        };
    }

    switch (req.body.result.action) {
        case "product.ingredients":
            action = require("./src/GetDetails");
            Cards.productPayload = require('./src/SendPayload').ProductInfo();
            action.getDetails(Sessions, sessionId, Sessions[sessionId].RETAINED_DETAIL_QUERY, ConstDetails.INGREDIENTS).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "consumption.tips":
            action = require("./src/GetDetails");
            Cards.productPayload = require('./src/SendPayload').ProductInfo();
            action.getDetails(Sessions, sessionId, Sessions[sessionId].RETAINED_DETAIL_QUERY, ConstDetails.TIPS).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "product.history":
            action = require("./src/GetDetails");
            Cards.productPayload = require('./src/SendPayload').ProductInfo();
            action.getDetails(Sessions, sessionId, Sessions[sessionId].RETAINED_DETAIL_QUERY, ConstDetails.HISTORY).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "size":
            action = require("./src/GetDetails");
            Cards.productPayload = require('./src/SendPayload').ProductInfo();
            action.getDetails(Sessions, sessionId, Sessions[sessionId].RETAINED_DETAIL_QUERY, ConstDetails.SIZE).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "product-detail":
            action = require("./src/GetDetails");
            Sessions[sessionId].RETAINED_DETAIL_QUERY = req.body.result.resolvedQuery;
            action.getDetails(Sessions, sessionId, req.body.result.resolvedQuery, ConstDetails.NONE).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "product.detail.payload":
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(Cards.pdetails));
            break;
        case "brands": //Done this way in order not to complicate the code
        case "loadMoreBrands":
            action = require('./src/ListBrands');
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            Cards.brPayload = require('./src/SendPayload').genericTemplate();
            Sessions[sessionId].RETAINED_CATEGORY_VALUE = "";
            if (req.body.result.action === "brands") {
                Sessions[sessionId].BRAND_INCREMENT = 0;
                Sessions[sessionId].LOAD_BRANDS_COUNT = 0;
            }
            action.listBrands(Sessions, sessionId).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "categories": //Done this way in order not to complicate the code
        case "loadMoreCategories":
            action = require('./src/ListCategories');
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            Cards.caPayload = require('./src/SendPayload').genericTemplate();
            if (req.body.result.action === "categories") {
                Sessions[sessionId].CATEGORIES_INCREMENT = 0;
                Sessions[sessionId].LOAD_CATEGORIES_COUNT = 0;
            }
            action.listCategories(Sessions, sessionId).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "smalltalk.greetings.hello":
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(payload.StartReply())).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "category.search": //Done this way in order not to complicate the code
        case "search.more.categories":
            action = require('./src/SearchCategoryProduct');
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            Cards.caProd = require('./src/SendPayload').qRepTemplate("Categories");
            if (req.body.result.action === "category.search") {
                Sessions[sessionId].CATEGORY_PRODUCTS = 0;
                Sessions[sessionId].CATEGORY_PRODUCTS_COUNT = 0;
                Sessions[sessionId].RETAINED_CATEGORY_VALUE = req.body.result.resolvedQuery;
            }
            action.searchCategoryProduct(Sessions, sessionId, req.body.result.resolvedQuery).then((output) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(output));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "brands.search": //Done this way in order not to complicate the code
        case "search.more.brands":
            action = require('./src/SearchBrandProduct');
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            Cards.brProd = require('./src/SendPayload').qRepTemplate("Brands");
            if (req.body.result.action === "brands.search") {
                Sessions[sessionId].BRANDS_PRODUCTS = 0;
                Sessions[sessionId].BRANDS_PRODUCTS_COUNT = 0;
                Sessions[sessionId].RETAINED_BRAND_VALUE = req.body.result.resolvedQuery;
            }
            action.searchBrandProduct(Sessions, sessionId, req.body.result.resolvedQuery).then((output) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(output));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "input.unknown": //Done this way in order not to complicate the code
        case "search.more.products":
            action = require('./src/SearchProduct');
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            Cards.glProd = require('./src/SendPayload').qRepTemplate();
            if (req.body.result.action === "input.unknown") {
                Sessions[sessionId].GLOBAL_SEARCH_PAGE = 0;
                Sessions[sessionId].GLOBAL_SEARCH_PRODUCT = 0;
                Sessions[sessionId].PRODUCT_RETAINED_VALUE = req.body.result.resolvedQuery;
            }
            else {
                Sessions[sessionId].SIZE_ARRAY = [];
                Sessions[sessionId].PRODUCT_SIZE_VALUE = 0;
                Sessions[sessionId].PRODUCT_SIZE_PAGE = 0;
                Cards.psize = require('./src/SendPayload').ProductSize();
            }
            action.searchProduct(Sessions, sessionId, req.body.result.resolvedQuery).then((output) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(output));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "filter.by.size": //Done this way in order not to complicate the code
        case "filter.more.sizes":
            action = require('./src/ProductSize');
            if (req.body.result.action === "filter.by.size") {
                Sessions[sessionId].PRODUCT_SIZE_PAGE = 0;
                Sessions[sessionId].PRODUCT_SIZE_VALUE = 0;
                Sessions[sessionId].WANTED_PRODUCT_VALUE = 0;
                Sessions[sessionId].WANTED_PRODUCT_PAGE = 0;
            }
            Cards.psize = require('./src/SendPayload').ProductSize();
            action.GetSizes(Sessions, sessionId, Sessions[sessionId].PRODUCT_RETAINED_VALUE).then((output) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(output));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "product.size":
            action = require('./src/ProductSize');
            Sessions[sessionId].WANTED_SIZE = req.body.result.resolvedQuery;
            Cards.glProd = require('./src/SendPayload').qRepTemplate();
            action.GetProductsPerSize(Sessions, sessionId, Sessions[sessionId].PRODUCT_RETAINED_VALUE).then((output) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(output));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "back.to.filters":
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(payload.filterReply())).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
        case "search.phrase.intent":
            Cards.pdetails = require('./src/SendPayload').ProductDetails();
            Cards.caProd = require('./src/SendPayload').qRepTemplate("Categories");
            Cards.brProd = require('./src/SendPayload').qRepTemplate("Brands");
            Sessions[sessionId].BRANDS_PRODUCTS = 0;
            Sessions[sessionId].BRANDS_PRODUCTS_COUNT = 0;
            Sessions[sessionId].CATEGORY_PRODUCTS = 0;
            Sessions[sessionId].CATEGORY_PRODUCTS_COUNT = 0;
            res.setHeader('Content-Type', 'application/json');
            // Only categories
            if (req.body.result.parameters.category.length !== 0 && req.body.result.parameters.brands.length === 0) {
                action = require('./src/SearchCategoryProduct');
                Sessions[sessionId].RETAINED_PHRASE = req.body.result.parameters.category;
                action.searchCategoryProduct(Sessions, sessionId, Sessions[sessionId].RETAINED_PHRASE).then((output) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(output));
                }).catch((error) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        'speech': error,
                        'displayText': error
                    }));
                });
            }
            // Only brands
            else if (req.body.result.parameters.brands.length !== 0 && req.body.result.parameters.category.length === 0) {
                action = require('./src/SearchBrandProduct');
                Sessions[sessionId].RETAINED_PHRASE = req.body.result.parameters.brands;
                action.searchBrandProduct(Sessions, sessionId, Sessions[sessionId].RETAINED_PHRASE).then((output) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(output));
                }).catch((error) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        'speech': error,
                        'displayText': error
                    }));
                });
            }
            // Both brands & categories
            else if (req.body.result.parameters.brands.length !== 0 && req.body.result.parameters.category.length !== 0) {
                Sessions[sessionId].RETAINED_CATEGORY_VALUE = req.body.result.parameters.category;
                Sessions[sessionId].RETAINED_BRAND_VALUE = req.body.result.parameters.brands;
                action = require('./src/SearchBrandProduct');
                Cards.pdetails = require('./src/SendPayload').ProductDetails();
                Cards.brProd = require('./src/SendPayload').qRepTemplate("Brands");
                Sessions[sessionId].BRANDS_PRODUCTS = 0;
                Sessions[sessionId].BRANDS_PRODUCTS_COUNT = 0;
                Sessions[sessionId].CATEGORY_PRODUCTS = 0;
                Sessions[sessionId].CATEGORY_PRODUCTS_COUNT = 0;
                action.searchBrandProduct(Sessions, sessionId, Sessions[sessionId].RETAINED_BRAND_VALUE).then((output) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(output));
                }).catch((error) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        'speech': error,
                        'displayText': error
                    }));
                });
            }
            break;
        case "buy.product":
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(web));
            break;
        case "get.infos":
            action = require('./src/GetInfos');
            Sessions[sessionId].RETAINED_DETAIL_QUERY = req.body.result.resolvedQuery;
            action.getInfos(Sessions, sessionId, req.body.result.resolvedQuery).then((detail) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(detail));
            }).catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'speech': error,
                    'displayText': error
                }));
            });
            break;
    } /* End of switch */ 
});