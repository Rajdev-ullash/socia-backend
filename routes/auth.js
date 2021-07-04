const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req, res) => {
    res.send('hello');
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: 'please enter all required fields' })
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: 'This email already exists.' })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch((error) => {
                            console.log(err)
                        })
                })

        })
        .catch((error) => {
            console.log(err)
        })

})

router.post('/signin', (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({ error: 'please add email or password'})
    }
    User.findOne({email: email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({ error: 'Invalid email or password'})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json('sign In Success')
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email} = savedUser
                res.json({ token,user:{_id, name, email}})
            }
            else{
                return res.status(422).json({ error: 'Invalid email or password'})  
            }
        })
        .catch(err =>{
            console.log(err);
        })
    })
})

module.exports = router