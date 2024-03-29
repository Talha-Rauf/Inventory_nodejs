const {checkAuthenticated} = require('../services/authService');
const services = require('../services/render');
const gpuServices = require('../services/gpuRoutes')
const express = require("express");
const gpuController = require("../controller/gpuController");
const userController = require("../controller/userController");
const authService = require("../services/authService");
const router = express.Router();

// User related operations
router.get('/', [
    checkAuthenticated,
    services.viewUserPage
]);

router.get('/add-gpu',
    checkAuthenticated,
    gpuServices.viewAddMyGPUPage
);

router.get('/update-user/:id', [
    checkAuthenticated,
    services.viewUpdateUserSelfPage
]);

router.patch('/update-user/:id',
    checkAuthenticated,
    userController.updateUserSelf
);

// GPU Related operations
router.get('/view-gpu/:id',
    checkAuthenticated,
    gpuController.getMyGPU
);

router.get('/update-gpu/:id',
    checkAuthenticated,
    gpuServices.viewUpdateMyGPUPage
);

router.get('/delete-gpu/:id',
    checkAuthenticated,
    gpuServices.viewDeleteMyGPUPage
);

router.post('/add-gpu',
    gpuController.addMyGPU
);

router.patch('/update-gpu/:id',
    checkAuthenticated,
    gpuController.updateMyGPU
);

router.delete('/delete-gpu/:id',
    checkAuthenticated,
    gpuController.deleteMyGPU
);

router.get('/update-user/upload-image/:id',
    checkAuthenticated,
    services.viewUploadMyImagePage
);

router.post('/update-user/upload-image/:id',
    userController.uploadMyImage
);

module.exports = router;