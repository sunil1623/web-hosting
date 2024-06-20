import { AmplifyClient, StartDeploymentCommand, StartDeploymentCommandInput } from "@aws-sdk/client-amplify";

export const startDeployment = async (input:StartDeploymentCommandInput) => {
    try {
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        
        const command = new StartDeploymentCommand(input);
        const startData = await amplifyClient.send(command);
    
        if(startData.$metadata.httpStatusCode !== 200){
            return console.error("Error creating Starting Deployment");
        }
    
        return startData.jobSummary;
    } catch (error) {
        console.error(error);
    }
}