const {checkAuthenticated, checkUserInSession} = require('../services/authService');
const {sameUserOrAdminRequiredForGPU} = require("../services/userRoutesConfig");
const services = require('../services/render');
const express = require("express");
const gpuController = require("../controller/gpuController");
const gpuServices = require("../services/gpuRoutes");
const router = express.Router();

router.get('/add-gpu',
    checkAuthenticated,
    gpuServices.viewAddGPUPage
);

router.get('/',
    checkAuthenticated,
    gpuController.getAllGPUs
);

router.get('/:id',
    checkAuthenticated,
    gpuController.getGPU
);

router.get('/update-gpu/:id',
    checkAuthenticated,
    sameUserOrAdminRequiredForGPU,
    gpuServices.viewUpdateGPUPage
);

router.get('/delete-gpu/:id',
    checkAuthenticated,
    sameUserOrAdminRequiredForGPU,
    gpuServices.viewDeleteGPUPage
);

router.post('/add-gpu',
    gpuController.addGPU
);

router.patch('/update-gpu/:id',
    checkAuthenticated,
    sameUserOrAdminRequiredForGPU,
    gpuController.updateGPU
);

router.delete('/delete-gpu/:id',
    checkAuthenticated,
    sameUserOrAdminRequiredForGPU,
    gpuController.deleteGPU
);

module.exports = router;