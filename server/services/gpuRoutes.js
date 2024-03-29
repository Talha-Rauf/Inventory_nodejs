const services = require('./render');

const viewAddGPUPage = async (req, res) => {
    console.log('LOADING ADD-GPU PAGE...');
    await services.addGPUPage(req, res, 'addGPU');
}

const viewAddMyGPUPage = async (req, res) => {
    await services.addGPUPage(req, res, 'addMyGPU');
}

const viewUpdateGPUPage = async (req, res) => {
    await services.editGPUPage(req, res, 'editGPU');
}

const viewUpdateMyGPUPage = async (req, res) => {
    await services.editGPUPage(req, res, 'editMyGPU');
}

const viewDeleteGPUPage = async (req, res) => {
    await services.viewDeleteGPUPage(req, res, 'confirmGPUDeletion')
}

const viewDeleteMyGPUPage = async (req, res) => {
    await services.viewDeleteGPUPage(req, res, 'confirmMyGPUDeletion')
}

module.exports = {
    viewAddGPUPage,
    viewAddMyGPUPage,
    viewUpdateGPUPage,
    viewUpdateMyGPUPage,
    viewDeleteGPUPage,
    viewDeleteMyGPUPage
}