const Joi = require('@hapi/joi');

const newCategoryValidation = (data) => {

    const schema = Joi.object({
        name: Joi.string().required(),
        parent: Joi.string(),
        description: Joi.string().max(4096),
        products: Joi.array()
    });

    return schema.validate(data);
}

module.exports.newCategoryValidation = newCategoryValidation;