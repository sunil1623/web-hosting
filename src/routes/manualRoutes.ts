import express from 'express'
import fileupload from 'express-fileupload';

import {createAppBranch, deleteAppBranch, deploymentApp, getAllApp, getApp, updateAppBranch, updateStatus} from '../controllers/manualDeployController';

const router = express.Router();

router.post('/createApp',createAppBranch);

router.patch('/updateApp/:id',updateAppBranch);

router.delete('/deleteApp/:id',deleteAppBranch);


router.post('/startDeployment/:id',fileupload(),deploymentApp);

// router.get('/getJob/:id',getAppJob);
router.get('/getStatus/:id',updateStatus);

router.get('/getApp/:id',getApp);

router.get('/getApp',getAllApp);

export default router;