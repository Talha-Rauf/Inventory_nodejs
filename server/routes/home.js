const services = require('../services/render');
const userController = require('../controller/userController');
const authService = require('../services/authService');
const express = require("express");
const router = express.Router();
const flash = require("connect-flash");

router.use(flash());

router.get('/', services.viewHomePage);

router.get('/login', [
    authService.checkNotAuthenticated,
    services.viewLoginPage
]);

router.get('/signup', [
    authService.checkNotAuthenticated,
    services.viewSignUpPage
]);

router.get('/reset',
    authService.checkNotAuthenticated,
    services.viewConfirmEmailPage
);

router.get('/password-reset/:id',
    authService.checkNotAuthenticated,
    services.viewPasswordResetPage
);

router.delete('/logout', [
    authService.logoutUser
]);

router.post('/login',
    authService.checkEmailVerified,
    authService.authenticateUser
);

router.post('/signup', [
    authService.checkNotAuthenticated,
    userController.signupUser,
]);

router.patch('/password-reset/:id',
    userController.checkIfFalse,
    userController.changePassword
);

router.post('/reset',
    userController.sendEmailForReset
);

router.get('/email-verification/:id',
    userController.confirmEmail
);

module.exports = router;