const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // - first name
    // - last name
    // - email
    // - password
    // - date of birth
    // - Hobbies(Multiple)
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    hobbies: {
        type: [String],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    }
});

module.exports = User = mongoose.model('user', UserSchema);