const mongoose = require('mongoose');
const bcrpyt = require('bcrypt')
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});


UserSchema.methods.isValidPassword = async function (password) {
    return await bcrpyt.compare(password, this.password);
}

const User = mongoose.model('user', UserSchema);
module.exports = User;