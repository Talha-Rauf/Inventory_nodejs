const mongoose = require("mongoose");

var mySchema = new mongoose.Schema({

    avatarURL:{
        type: String
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        //validate: emailValidator,
        lowercase: true,
        required: true
    },
    password:{
        type: String,
        //validate: passwordValidator,
        minlength: 2,
        required: true
    },
    gender: String,
    status: String,
    role: {
        type: String,
        default: 'user'
    },
    emailVerified: {
        type: Boolean,
        defaultValue: false,
    },
    checkFalse: {
        type: Boolean,
        defaultValue: false,
    },
});

mySchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

module.exports = mongoose.model('user', mySchema);

// Goes inside the above function:
// const validate = require('mongoose-validator');
//
// const emailValidator = [
//     validate({
//         validator: 'isEmail',
//         message: 'Please fill a valid email address'
//     })
// ];
//
// const passwordValidator = [
//     validate({
//         validator: 'isLength',
//         arguments: [6, 50],
//         message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
//     }),
//     validate({
//         validator: 'matches',
//         arguments: /\d/,
//         message: 'Password should contain numbers'
//     }),
//     validate({
//         validator: 'matches',
//         arguments: /[a-zA-Z]/,
//         message: 'Password should contain letters'
//     }),
//     validate({
//         validator: 'matches',
//         arguments: /[A-Z]/,
//         message: 'Password must contain one uppercase letter'
//     }),
//     validate({
//         validator: 'matches',
//         arguments: /[\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/,
//         message: 'Password should contain a special characters like !@#$%^&*()_+'
//     })
// ];
