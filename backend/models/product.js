const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const productSchema =  new Schema({
    productName : {type: String},
    productPrice : {type: Number},
    productDescription : {type: String},
    productImage : {type: String},
    productQuantity : {type: Number},
    createdOn : {type: Date}
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;