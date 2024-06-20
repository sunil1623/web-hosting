import { Request,Response, NextFunction } from "express";

import App from "../model/appSchema";
import catchAsync from "../util/catchAsync";
import { createApp } from "../lib/amplify/createApp";
import { createBranch } from "../lib/amplify/createBranch";
import { updateApp } from "../lib/amplify/updateApp";
import { updateBranch } from "../lib/amplify/updateBranch";
import { deleteApp } from "../lib/amplify/deleteApp";
import { createDeployment } from "../lib/amplify/createDeployment";
import { startDeployment } from "../lib/amplify/startDeployment";
import { uploadFile } from "../lib/amplify/uploadFile";
import { getJob } from "../lib/amplify/getJob";

type ManualDeployBody = {
    name:string,
    branchName:string,
    displayName:string
}


export const createAppBranch = catchAsync(async function(req:Request,res:Response,next:NextFunction) {
    const body:ManualDeployBody = req.body;
    console.log(body);

    const appData = await createApp({name:body.name});

    if(!appData){
        console.error("Error Creating App");
        return next();
    }

    const input = {
        branchName: body.branchName,
        appId:appData?.appId,
        displayName:body.displayName
    }

    const branchData = await createBranch(input);
    
    if(!branchData){
        console.error("Error Creating Branch");
        return next();
    }

    const appBranch = await App.create({
        appName: appData.name,
        appId: appData.appId,
        branchName: branchData?.branchName,
        domain: `${req.protocol}://${branchData.displayName}.${appData.appId}.amplifyapp.com`
    })

    res.status(200).json({
        status:"success",
        message: {
            app:appBranch
        }
    });
});

export const updateAppBranch = catchAsync(async(req:Request,res:Response,next:NextFunction) =>{
    const {id} = req.params;
    const {name,displayName} = req.body;

    if(!id || !name){
        console.error("Id or Body is undefined");
        return next();
    }

    const appBranch = await App.findById(id);

    if(!appBranch){
        console.error("Error finding App");
        return next();
    }

    const appData = await updateApp({appId: appBranch.appId,name});
    
    if(!appData){
        console.error("Error Updating App");
        return next();
    }
    console.log(appData);

    const branchData = await updateBranch({appId:appBranch.appId,branchName:appBranch.branchName,displayName});
    
    if(!branchData){
        console.error("Error Updating Branch");
        return next();
    }
    console.log(branchData);
    
    const updatedAppBranch = await App.findByIdAndUpdate(id,{
        appName: appData.name,
        branchName: branchData.branchName,
        domain: `https://${branchData.displayName}.${appData.appId}.amplifyapp.com`
    },{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        status:"success",
        message:{
            app:updatedAppBranch
        }
    });
});

export const deleteAppBranch = catchAsync(async(req:Request,res:Response,next:NextFunction) =>{
    const {id}=req.params;

    if(!id){
        console.error("Id or Body is undefined");
        return next();
    }

    const appBranch = await App.findById(id);

    if(!appBranch){
        console.error("Error finding App");
        return next();
    }

    const appData = await deleteApp({appId:appBranch.appId});
    console.log(appData);

    const deletedAppBranch = await App.findByIdAndDelete(id,{new:true});
    console.log(deletedAppBranch);

    res.status(200).json({
        status:"success"
    });
});

export const deploymentApp = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params;
    if(!id || !req.files){
        console.error("Id or File are not Found!");
        return next();
    }
    const files = Object.assign({},req.files?.zipFile as any);
    console.log(files);
    const hash:string = files.md5;
    const key = files.name;
    const data:Buffer = files.data;
    console.log(key,hash);

    if(!key || !hash || !data){
        console.error("Key or Hash or Data not Found!");
        return next();
    }

    const appBranch = await App.findById(id);
    if(!appBranch){
        console.error("App is not Found");
        return next();
    }

    const input = {
        appId: appBranch?.appId,
        branchName: appBranch?.branchName,
    }
    
    const deploymentData = await createDeployment(input);
    console.log(deploymentData);

    if(!deploymentData){
        console.error("Error while creating deployment");
        return next();
    }

    const uploadData = await uploadFile(deploymentData,data);

    console.log(uploadData);

    if(uploadData.status !== 200){
        console.error("Error while uploading");
        return next();
    }

    const startDeploymentData = await startDeployment({
        appId:appBranch.appId,
        branchName:appBranch.branchName,
        jobId:deploymentData.jobId
    });

    if(!startDeploymentData){
        console.error("Error start Deployment");
        return next();
    }

    const updatedAppBranch = await App.findByIdAndUpdate(id,{
        jobId:deploymentData.jobId,
        status:startDeploymentData.status,
    },{
        new: true,
        runValidators: true,
    })

    // JobID update in Database App
    res.status(200).json({
        status:"success",
        message:{
            app:updatedAppBranch
        }
    });
});


export const getApp = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const {id} = req.params;
    if(!id){
        console.error("No Id Found!");
        return next();
    }
    const appBranch = await App.findById(id);
    
    res.status(200).json({
        status:"success",
        message:{
            app:appBranch
        }
    })
});

export const getAllApp = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const allAppBranch = await App.find();
    
    if(!allAppBranch){
        console.error("Error fetching all apps");
        return next();
    }
    
    res.status(200).json({
        status:"success",
        message:{
            apps:allAppBranch
        }
    })
})

const getAppJob = async (input:{appId:string,branchName:string,jobId:string}) => {    
    const getJobData = await getJob(input);
    console.log(getJobData);

    if(!getJobData){
        console.error("Error getting Job data");
        return;
    }

    return getJobData.summary?.status;
}

export const updateStatus = catchAsync(async (req:Request,res:Response,next:NextFunction) => {
    const {id} =  req.params;
    console.log(id);
    if(!id){
        console.error("No Id Found!");
        return;
    }
    const appBranch = await App.findById(id);

    console.log(appBranch);

    if(!appBranch){
        console.error("Error fetching App");
        return next();
    }

    if(appBranch.status === 'SUCCEED' || appBranch.status === 'FAILED'){
        return res.status(200).json({
            status:"success",
            message:{
                app:appBranch
            }
        })
    }

    let data;
    let updatedAppBranch;
    const myInterval = setInterval(async () => {
        data = await getAppJob({appId:appBranch?.appId,branchName: appBranch?.branchName,jobId: appBranch?.jobId!})
        console.log(data);
        if(!data){
            clearInterval(myInterval);
            return next();
        }
        if(data === 'SUCCEED' || data === "FAILED"){
            updatedAppBranch = await App.findByIdAndUpdate(id,{
                status:data,
            },{
                new: true,
                runValidators: true,
            });
            clearInterval(myInterval);
            res.status(200).json({
                status:"success",
                message:{
                    app:updatedAppBranch
                }
            })
        }
    }, 3000);

})