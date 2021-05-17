const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    description: {
        type: String,
        max: 4096,
        min: 6
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        }
    ]

});


// const categoryMapSchema = new mongoose.Schema({
//     categoryId: {
//         type: mongoose.Types.ObjectId,
//         ref: "Category"
//     },
//     productId:
//     {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product"
//     }
// });
// module.exports.CategoryMap = mongoose.model('CategoryMap ', categoryMapSchema);
module.exports.Category = mongoose.model('Category', categorySchema);