const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
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
    points: {
        type: Number,
        default: 0
    }
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

UserSchema.methods.checkPassword = async function(password) {
    const passwordMatch = await bcrypt.compare(password, this.password);
    return passwordMatch;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
// explain the above in detail in next comment
// The user model is a simple mongoose schema with three fields: username, email, and password. The password field is hashed using the bcryptjs library before saving it to the database. The checkPassword method is used to compare the hashed password with the password entered by the user during login. The User model is then exported to be used in the authentication routes.