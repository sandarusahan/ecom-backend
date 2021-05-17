const router = require('express').Router();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation/userValidation')


router.post('/register', async (req, res) => {

    //validate user inputs
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user already exists
    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck) return res.status(400).send('Email already exists');

    //Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    });
    try {

        const savedUser = await user.save();
        res.send({ userId: user._id });
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    //validate user inputs
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user exists
    const userObj = await User.findOne({ email: req.body.email });
    if (!userObj) return res.status(400).send('Email does not exists');

    //Check password
    const validPass = await bcrypt.compare(req.body.password, userObj.password);
    if(!validPass) return res.status(400).send('Password invalid');

    //Create jwt
    const token = jwt.sign({_id: userObj._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});
module.exports = router;