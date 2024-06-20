import { AmplifyClient, GetJobCommand, GetJobCommandInput } from "@aws-sdk/client-amplify";

export const getJob = async (input:GetJobCommandInput) => {
    try {
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        const command = new GetJobCommand(input);
        const getJobData = await amplifyClient.send(command);
    
        if(getJobData.$metadata.httpStatusCode !== 200){
            console.error("Error Getting Job Data");
        }
    
        return getJobData.job;
    } catch (error) {
        console.error(error);
    }
}