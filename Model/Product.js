const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    price: {
        type: Number,
        required: true,
        max: 255,
        min: 6
    },
    quatity: {
        type: Number
    },
    description: {
        type: String,
        max: 4096,
        min: 6
    },
    manufacturer: {
        type: String
    },
    categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Category"
        }
    ],
    outofstock: {
        type: Boolean
    },
    tags: {
        type: String
    },
    active: {
        type: Boolean
    },
    images: {
        type: [String],
        required: true,
        max: 14,
        min: 4
    }
    ,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports.Product = mongoose.model('Product', productSchema);