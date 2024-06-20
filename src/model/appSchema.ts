import mongoose from "mongoose";


const appSchema = new mongoose.Schema(
    {
        appName: {
            type: String,
            required: [true, 'App Name required!'],
        },
        appId: {
            type: String,
            required: [true,"AppId Required!"]
        },
        branchName: {
            type: String,
            required:[true,"BranchName is required"]
        },
        domain:{
            type: String,
            required:[true,"domain is required"]
        },
        repository:{
            type: String,
        },
        environmentalVariables:{
            type: Object,
        },
        jobId:{
            type: String,
        },
        status:{
            type:String,
        }
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
);

export default mongoose.model('App', appSchema);