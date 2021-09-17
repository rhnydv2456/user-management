const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route POST api/users
// @describe Register users
// @access public

router.post('/', [
    check('firstname', 'firstName is required.').not().isEmpty(),
    check('lastname', 'lastname is required.').not().isEmpty(),
    check('email', 'Please enter valid email address.').isEmail(),
    check('password', 'Password must be minimum 6 digit.').isLength({ min: 6 })
], async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { firstname, lastname, email, dateOfBirth, hobbies, password } = req.body;
    console.log(req.body)
    try {
        let user = await User.findOne({ email });
        // user exist
        if (user) {
            return res.status(400).json({ error: [{ msg: 'Email already exist!' }] });
        }
        const profileFields = {};
        if (firstname) profileFields.firstname = firstname;
        if (lastname) profileFields.lastname = lastname;
        if (email) profileFields.email = email;
        if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
        if (hobbies) profileFields.hobbies = hobbies.split(',').map(hobby => hobby.trim());


        // encrypt password
        const salt = await bcrypt.genSalt(10);

        profileFields.password = await bcrypt.hash(password, salt);

        let profile = await User.findOne({ email: email });

        if (profile) {
            // Update
            profile = await User.findOneAndUpdate(
                { email: email },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        }

        // creating instance
        user = new User(profileFields);

        await user.save();

        // return jsonwebtoken

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;