import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const productSchema =  new Schema({
    productName : {type: String},
    productPrice : {type: Number},
    productDescription : {type: String},
    productImage : {type: String},
    productQuantity : {type: Number},
    createdOn : {type: Date}
})

export const Product = mongoose.model('Product', productSchema);