const router = require('express').Router();
const {Product, Category} = require('../Model/Product');
const verify = require('./verifyToken');
const { newProductValidation } = require('../validation/productValidation');
const mongoose = require('mongoose');

const toId = mongoose.Types.ObjectId;

router.get('/', verify, async (req, res) => {
    try {
        const allProducts = await Product.find({active: true}).populate( "categories",  { name:1, description:1} );
        res.json(allProducts);          

    } catch (error) {
        console.log(error)
        res.json({message: error});
    }
});

router.get('/all', verify, async (req, res) => {
    try {
        const allProducts = await Product.find({}).populate( "categories",  { name:1, description:1} );
        res.json(allProducts);          

    } catch (error) {
        console.log(error)
        res.json({message: error});
    }
});

router.get('/:prodId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.prodId).populate( "categories",  { name:1, description:1} );
        res.json(product);
    } catch (error) {
        console.log(error)
        res.json({message: error});
    }
});

router.post('/', async (req, res) => {

    //validate user inputs
    const { error } = newProductValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if product already exists
    const findProduct = await Product.findOne({ name: req.body.name });
    if(findProduct) return res.status(400).send("Product '"+findProduct.name+"' already exists");

    const categories = req.body.categories;
    let categoryIds = [];
    categories.forEach(category => {
        categoryIds.push( toId(category) );
    });
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        quatity: req.body.quatity,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        outofstock: req.body.outofstock,
        tags: req.body.tags,
        active: req.body.active,
        images: req.body.images,
        categories: categoryIds
    });
    try {

        const savedProduct = await product.save();
        res.send({ product: savedProduct });
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

router.put('/:prodId', async (req, res) => {

    //validate user inputs
    const { error } = newProductValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if product already exists
    const findProduct = await Product.findById(req.params.prodId);
    if(!findProduct) return res.status(400).send("Product does not exists");

    const categories = req.body.categories;
    let categoryIds = [];
    categories.forEach(category => {
        categoryIds.push( toId(category) );
    });

    const modProduct = {
        name: req.body.name,
        price: req.body.price,
        quatity: req.body.quatity,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        outofstock: req.body.outofstock,
        tags: req.body.tags,
        active: req.body.active,
        images: req.body.images,
        categories: categoryIds
    };
    try {

        const updatedProduct = await Product.updateOne({ _id : req.params.prodId}, { $set : modProduct});
        res.send({ updatedProduct });
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

router.delete('/:prodId', async (req, res) => {
    try {
        const remProduct = await Product.deleteOne({ _id : req.params.prodId});
        res.json(remProduct);
    } catch (error) {
        console.log(error)
        res.json({message: error});
    }
});


module.exports = router;
