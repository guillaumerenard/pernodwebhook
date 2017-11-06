const unirest = require("unirest");
const apiKey = 'u3xqy39ks5ff2a2mxsue4jnn';

/*
 * GLOBAL CONFIGURATION
 */

module.exports = {
    requestProductId: function (id) {
        let req = unirest("GET", `https://api.pernod-ricard.io/v2/product/${id}/en_US?htmlformat=false`);

        req.query({
            "htmlformat": "false"
        });

        req.headers({
            "cache-control": "no-cache",
            "api_key": apiKey
        });
        return (req)
    },

    requestProductByBrand: function (brand) {
        let req = unirest("GET", `https://api.pernod-ricard.io/v2/product?brandId=${brand}&retailerId=en_US-walmart&pageLength=1000`);
        req.query({
            "htmlformat": "false"
        });

        req.headers({
            "cache-control": "no-cache",
            "api_key": apiKey
        });
        return (req)
    },

    requestProductByCategory: function (category) {
        let req = unirest("GET", `https://api.pernod-ricard.io/v2/product?categoryId=${category}&retailerId=en_US-walmart&pageLength=1000`);
        req.query({
            "htmlformat": "false"
        });

        req.headers({
            "cache-control": "no-cache",
            "api_key": apiKey
        });
        return (req)
    },

    requestProductList: function (keys) {
        let req = unirest("GET", `https://api.pernod-ricard.io/v2/product?q=${keys}&retailerId=en_US-walmart&pageLength=1000`);
        req.query({
            "htmlformat": "false"
        });

        req.headers({
            "cache-control": "no-cache",
            "api_key": apiKey
        });
        return (req)
    },

    requestCategories: function () {
        let req = unirest("GET", `https://api.pernod-ricard.io/v2/product/category?locale=en_US&pageLength=1000`);

        req.headers({
            "cache-control": "no-cache",
            "api_key": apiKey
        });
        return (req)
    },

    requestBrands: function () {
        let req = unirest("GET", `https://api.pernod-ricard.io/v2/product/brand?locale=en_US&pageLength=1000`);

        req.headers({
            "cache-control": "no-cache",
            "api_key": apiKey
        });
        return (req)
    }
};