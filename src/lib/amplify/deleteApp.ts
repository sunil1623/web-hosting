import { AmplifyClient, DeleteAppCommand, DeleteAppCommandInput } from "@aws-sdk/client-amplify";


export const deleteApp = async (input:DeleteAppCommandInput) => {
    try{
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        const command = new DeleteAppCommand(input);
        const appData = await amplifyClient.send(command);

        if(appData.$metadata.httpStatusCode !== 200){
            return console.error("Error Deleting App");
        }
        
        return appData;
    }catch(err){
        console.error(err);
    }
}