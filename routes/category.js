const router = require('express').Router();
const mongoose = require('mongoose');
const { Category, CategoryMap } = require("../Model/Category");
const { Product } = require('../Model/Product');
const { newCategoryValidation } = require('../validation/categoryValidation');
const { isProductIdValid } = require('../validation/productValidation');
const verify = require('./verifyToken');

const toId = mongoose.Types.ObjectId;

router.get('/', verify, async (req, res) => {
    try {
        const allCategories = await Category.find({}, 'name description parent').populate("parents", { name:1, description:1});
        res.json(allCategories);
    } catch (error) {
        console.log(error);
        res.json({message: error});
    }
});

router.get('/with-products', verify, async (req, res) => {
    try {
        const allCategories = await Category.find({}).populate("parents", { name:1, description:1}).populate("products", {name:1, description:1, price:1, outofstock:1});
        res.json(allCategories);
    } catch (error) {
        console.log(error);
        res.json({message: error});
    }
});

router.get('/:catId', verify, async (req, res) => {
    try {
        const category = await Category.findById(req.params.catId, 'name description parent').populate("parents", { name:1, description:1});
        res.json(category);
    } catch (error) {
        console.log(error)
        res.json({message: error});
    }
});

router.get('/with-products/:catId', verify, async (req, res) => {
    try {
        const category = await Category.findById(req.params.catId).populate("parents", { name:1, description:1});
        res.json(category);
    } catch (error) {
        console.log(error)
        res.json({message: error});
    }
});

router.post('/', async (req, res) => {

    //validate user inputs
    const { error } = newCategoryValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // //Check if product already exists
    const findCategory = await Category.findOne({ name: req.body.name });
    if(findCategory) return res.status(400).send("Category with same name already exists");
    const parentCats = [];
    const products = req.body.products;
    req.body.parents.forEach(parentCatId => {
        parentCats.push(toId(parentCatId));
    });;
    
    const category = new Category ({
        name: req.body.name,
        parents: parentCats,
        description: req.body.description
    });

    try {
        const savedCategories = await category.save();
        assignProductsToCategory(savedCategories._id, products);
        res.send({ savedCategories });
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

router.post('/assign-products/:catId', async (req, res) => {

    // //Check if product already exists
    const category = await Category.findById(req.params.catId);
    if(!category) return res.status(400).send("Category does not exists");
    const products = req.body.products
    

    try {
        res.json(assignProductsToCategory(category._id, products));
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

async function assignProductsToCategory(categoryId, products) {
    const cat = await Category.findById(categoryId);
    const prods = [];
    products.forEach(async productId => {
        //validate product id
        const isProdIdValid = isProductIdValid(productId);
        if(!isProdIdValid) return res.status(400).send("Product ID is valid");
        
        //adding products to category
        prods.push(productId);

        //adding category to product
        Product.findByIdAndUpdate(productId, {$push: {"categories": {categoryId}}});
    });
    cat.products = [];
    cat.products = prods;
    cat.save();
    return cat;
}
module.exports = router;