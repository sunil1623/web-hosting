import { AmplifyClient, CreateDeploymentCommand, CreateDeploymentCommandInput, CreateDeploymentCommandOutput } from "@aws-sdk/client-amplify";
import { uploadFile } from "./uploadFile";

export const createDeployment = async (input:CreateDeploymentCommandInput) =>{
    try {
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });

        const command = new CreateDeploymentCommand(input);
        const deploymentData = await amplifyClient.send(command);
        
        if(deploymentData.$metadata.httpStatusCode !== 200){
            return console.error("Error creating Deployment");
        }
        
        return deploymentData;

    } catch (err) {
        console.error(err)
    }
}