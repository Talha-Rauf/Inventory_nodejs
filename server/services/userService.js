const httpStatus = require('http-status');
const bcrypt = require("bcrypt");
const {User} = require('../model/index');
const passport = require("passport");
const ApiError = require('../utils/ApiError');
const {transporter, mailOptions} = require("../config");

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
    if (await User.isEmailTaken(userBody.email)) {
        return undefined;
    }
    userBody.password = await bcrypt.hash(userBody.password, 10);
    return await User.create(userBody);
}

const updateUser = async (userID, updateBody) => {
    const user = await findByID(userID); // User found by ID in db
    const user_in_session = passport.session.user; // User logged in current session

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    let hashedPassword = await bcrypt.hash(updateBody.password, 10);

    const userUpdate = new User({
        _id: user._id,
        firstName: updateBody.firstName,
        lastName: updateBody.lastName,
        email: updateBody.email.toLowerCase(),
        password: updateBody.password === '' ? user.password : hashedPassword,
        gender: updateBody.gender,
        status: updateBody.status,
        role: user_in_session.role === 'admin' ? updateBody.role : user.role,
        emailVerified: updateBody.emailVerified,
        checkFalse: updateBody.checkFalse
    });

    Object.assign(user, userUpdate);
    await user.save();
}

const deleteUser = async (userID) => {
    const user = await findByID(userID);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
}

const changePassword = async (userID, updateBody) => {
    const user = await findByID(userID);
    let hashedPassword = await bcrypt.hash(updateBody.password, 10);
    await user.updateOne(
        { _id: userID },
        { $set: { password: hashedPassword } },
        { new: true }
    );
}

const changeCheckToTrue = async (userID) => {
    const user = await findByID(userID);
    await user.updateOne(
        { _id: userID },
        { $set: { check: true } },
        { new: true }
    );
}

const changeCheckToFalse = async (userID) => {
    const user = await findByID(userID);
    await user.updateOne(
        { _id: userID },
        { $set: { check: false } },
        { new: true }
    );
}

const sendEmailToUser = (user) => {
    transporter.sendMail(mailOptions(user), function(error, info) {
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
    updateUser,
    deleteUser,
    changePassword,
    changeCheckToTrue,
    changeCheckToFalse,
    sendEmailToUser
}
