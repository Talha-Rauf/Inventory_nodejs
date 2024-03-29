const httpStatus = require('http-status');
const bcrypt = require("bcrypt");
const {User} = require('../model/index');
const passport = require("passport");
const ApiError = require('../utils/ApiError');
const {transporter, mailForNewUser, mailForReset, mailForConfirmation} = require("../config");

const queryUsers = async (filter) => {
    return await User.find().sort(filter);
}

const findByID = async (id) => {
    return await User.findById(id);
};

const findByEmail = async (email) => {
    return await User.findOne({email});
};

const createUser = async (userBody) => {
    let newUser = userBody;
    if (await User.isEmailTaken(userBody.email)) {
        return undefined;
    }
    let generatedPassword = Math.random().toString(36).slice(-8);
    newUser.password === '...' ? await bcrypt.hash(generatedPassword, 10) : await bcrypt.hash(userBody.password, 10);
    newUser.avatarURL = 'https://user-management-js.s3.us-east-2.amazonaws.com/' + newUser.gender.toLowerCase() + '_avatar.jpg';
    newUser.checkFalse = true;
    return await User.create(newUser);
}

const signUpUser = async (userBody) => {
    let newUser = userBody;
    if (await User.isEmailTaken(userBody.email)) {
        return undefined;
    }
    newUser.password = await bcrypt.hash(userBody.password, 10);
    newUser.avatarURL = 'https://user-management-js.s3.us-east-2.amazonaws.com/' + newUser.gender.toLowerCase() + '_avatar.jpg';
    return await User.create(newUser);
}

const updateUser = async (userID, updateBody) => {
    let { default: fetch } = await import("node-fetch");

    const user = await findByID(userID); // User found by ID in db
    const user_in_session = passport.session.user; // User logged in current session
    if (!user) {throw new ApiError(httpStatus.NOT_FOUND, 'User not found');}

    let hashedPassword = await bcrypt.hash(updateBody.password, 10);
    let url = 'https://' + process.env.AWS_S3_BUCKET_NAME + '.s3.us-east-2.amazonaws.com/';
    const avatarUrlExists = await fetch(url + user._id + '.jpg');

    await User.updateOne(
        { _id: userID },
        { $set: {
                avatarURL: avatarUrlExists.ok === true ? url + user._id + '.jpg' : url + updateBody.gender.toLowerCase() + '_avatar.jpg',
                firstName: updateBody.firstName,
                lastName: updateBody.lastName,
                password: updateBody.password === '' ? user.password : hashedPassword,
                gender: updateBody.gender,
                role: user_in_session.role === 'admin' ? updateBody.role : user.role,
                emailVerified: user_in_session.emailVerified === true ? true : updateBody.emailVerified
        } },
        { new: true }
    );


    // User found by ID in db after update
    return await findByID(userID);
}

const deleteUser = async (userID) => {
    const user = await findByID(userID);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
}

const changePassword = async (userID, newPassword) => {
    let hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
        { _id: userID },
        { $set: { password: hashedPassword } },
        { new: true }
    );
}

const changeCheckToTrue = async (userID) => {
    await User.updateOne(
        { _id: userID },
        { $set: { checkFalse: true } },
        { new: true }
    );
}

const changeCheckToFalse = async (userID) => {
    await User.updateOne(
        { _id: userID },
        { $set: { checkFalse: false } },
        { new: true }
    );
}

const changeEmailVerifyToTrue = async (userID) => {
    await User.updateOne(
        { _id: userID },
        { $set: { emailVerified: true } },
        { new: true }
    );
}

const sendEmailForPassReset = (user) => {
    transporter.sendMail(mailForReset(user), function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendEmailForVerification = (user) => {
    transporter.sendMail(mailForConfirmation(user), function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendEmailForNewUser = (user) => {
    transporter.sendMail(mailForNewUser(user), function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    queryUsers,
    findByID,
    findByEmail,
    createUser,
    signUpUser,
    updateUser,
    deleteUser,
    changePassword,
    changeCheckToTrue,
    changeCheckToFalse,
    sendEmailForNewUser,
    sendEmailForPassReset,
    sendEmailForVerification,
    changeEmailVerifyToTrue
}
