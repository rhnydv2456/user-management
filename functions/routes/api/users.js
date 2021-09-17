const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route POST api/users
// @describe save users
// @access private

router.post('/', auth, [
    check('firstName', 'firstName is required.').not().isEmpty(),
    check('lastName', 'lastName is required.').not().isEmpty(),
    check('hobbies', 'hobbies is required.').not().isEmpty(),
    check('dateOfBirth', 'dateOfBirth is required.').not().isEmpty(),
    check('email', 'Please enter valid email address.').isEmail(),
    check('password', 'Password must be minimum 6 digit.').isLength({ min: 6 })
], async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { firstName, lastName, email, dateOfBirth, hobbies, password } = req.body;
    try {
        let user = await User.findOne({ email });
        // user exist
        if (user) {
            return res.status(400).json({ error: [{ msg: 'Email already exist!' }] });
        }
        const profileFields = {};
        if (firstName) profileFields.firstName = firstName;
        if (lastName) profileFields.lastName = lastName;
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

        res.json({ success: 'Data saved successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route GET api/users
// @describe return all users
// @access private

router.get('/', auth, async (req, res) => {
    User.find()
        .then((documents) => {
            return res.status(200).json({
                message: "users fetched successsfully!",
                users: documents,
            });
        });
});
module.exports = router;