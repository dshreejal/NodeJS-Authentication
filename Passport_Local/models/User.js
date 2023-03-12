const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: String,
    salt: String
});

const User = mongoose.model('user', UserSchema);
module.exports = User;