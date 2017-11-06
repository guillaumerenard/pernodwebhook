module.exports = {
    brPayload: require('./../SendPayload').genericTemplate(),
    caPayload: require('./../SendPayload').genericTemplate(),
    caProd: require('./../SendPayload').qRepTemplate("categories"),
    brProd: require('./../SendPayload').qRepTemplate("brands"),
    glProd: require('./../SendPayload').qRepTemplate(),
    productPayload: require('./../SendPayload').ProductInfo(),
    psize: require('./../SendPayload').ProductSize(),
    pdetails: require('./../SendPayload').ProductDetails()
};