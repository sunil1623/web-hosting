import { CreateDeploymentCommandOutput } from "@aws-sdk/client-amplify";

export const uploadFile = async (deploymentData:CreateDeploymentCommandOutput,files:Buffer) => {
    if(deploymentData.zipUploadUrl){
        try{
            const data = Buffer.from(files);
            const res = await fetch(deploymentData.zipUploadUrl,{
                method:"PUT",
                body: data
            })
        }catch(err){
            console.log(err);
            return {status: 400};
        }
        return {status: 200};
    }
    return {status:400}
}
