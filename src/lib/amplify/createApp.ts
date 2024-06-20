import { AmplifyClient, CreateAppCommand, CreateAppCommandInput, CreateAppCommandOutput } from "@aws-sdk/client-amplify";
// import amplifyClient  from "./amplifyClient";

export const createApp = async (input:CreateAppCommandInput) => {
    try{
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        const command = new CreateAppCommand(input);
        const appData = await amplifyClient.send(command);

        if(appData.$metadata.httpStatusCode !== 200){
            return console.error("Error creating App");
        }
        return appData.app;
    }catch(err){
        console.error(err);
    }
}