const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Joi = require('joi');
const authMiddleware = require('../JWT/middlewareJWT')

const router = express.Router();

const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ['com', 'org', 'net'] } }).required(),
    password: Joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/).required()
}) 

router.post('/users/signup', async (req, res, next) => {
    const { email, password } = schema.validate(req.body);

    const user = await User.findOne({ email }, { _id: 1 }).lean();

    if(user) {
        return res.status(409).json({ message: "Email in use" });
    }
    try {
        const newUser = new User({ email });
        await newUser.setPassword(password);
        await newUser.save();
        return res.status(201).json({
            "user": {
                "email": newUser.email,
                "subscription": newUser.subscription
        }
        });
    } catch (error) {
        next(error);
    }
}
 );

router.post('/users/login', async (req, res, next) => {
    const { email, password } = schema.validate(req.body);

    const user = await User.findOne({ email });

    if(!user) {
        return res.status(400).json({ message: "There is no user with this email" });
    }
    const isPasswordCorrect = await user.validatePassword(password);

    if(isPasswordCorrect) {
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(
            payload,
            process.env.SECRET,
            {expiresIn: '12h'}
        )
        user.token = token;
        await user.save(); 
        return res.status(200).json({
            "token": user.token,
            "user": {
                "email": user.email,
                "subscription": user.subscription
            }
        });
    } else {
        return res.status(401).json({message: "Email or password is wrong"})
    }
});

router.post('/users/logout', authMiddleware, async (req, res, next) => { 

    const userData = req.user;
    const user = await User.findOne({ _id: userData.id });

     if(!user) {
        return res.status(401).json({ message: "Not authorized" });
     } else {
         await User.updateOne({ _id: user.id }, { $set: { token: null } });
         return res.status(204)
    }

});
router.post('/users/current', authMiddleware, async (req, res, next) => {
    const userData = req.user;
    const user = await User.findOne({ _id: userData.id });

     if(!user) {
        return res.status(401).json({ message: "Not authorized" });
     } else {
         return res.status(200).json({
            "email": user.email,
            "subscription": user.subscription
         })
    }
 });

module.exports = router;