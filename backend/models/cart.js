const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductDetails = {
    productName : {type: String},
    productPrice : {type: Number},
    productQuantity : {type: Number},
    productImage : {type: String},
}

const cartSchema =  new Schema({
    productId : {type: String},
    customer_id : {type: String},
    productDetail: {type: ProductDetails}
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

