const Joi = require('@hapi/joi');
const { Product } = require('../Model/Product');

const newProductValidation = (data) => {

    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().positive().min(0.00).precision(2).required(),
        quatity: Joi.number().integer().positive().min(1).required(),
        description: Joi.string().max(500),
        images: Joi.array().max(5),
        manufacturer: Joi.string(),
        outofstock: Joi.boolean(),
        tags: Joi.string(),
        active: Joi.boolean(),
        categories: Joi.array()
    });

    return schema.validate(data);
}

const isProductIdValid = (prodId) => {

    const product = Product.findById(prodId);
    if(product) {
        return true;
    }else {
        return false;
    }
}

module.exports.newProductValidation = newProductValidation;
module.exports.isProductIdValid = isProductIdValid;