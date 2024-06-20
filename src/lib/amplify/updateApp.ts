import { AmplifyClient, UpdateAppCommand, UpdateAppCommandInput } from "@aws-sdk/client-amplify";


export const updateApp = async (input:UpdateAppCommandInput) => {
    try{
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        const command = new UpdateAppCommand(input);
        const appData = await amplifyClient.send(command);

        if(appData.$metadata.httpStatusCode !== 200){
            return console.error("Error updating App");
        }
        
        return appData.app;
    }catch(err){
        console.error(err);
    }
}