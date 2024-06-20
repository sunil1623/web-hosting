import { AmplifyClient, CreateBranchCommand, CreateBranchCommandInput } from "@aws-sdk/client-amplify";
// import amplifyClient  from "./amplifyClient";

export const createBranch = async (input:CreateBranchCommandInput) =>{
    try {
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        const command = new CreateBranchCommand(input);
        const branchData = await amplifyClient.send(command);
        
        if(branchData.$metadata.httpStatusCode !== 200){
            return console.error("Error creating Branch");
        }

        return branchData.branch;
    } catch (err) {
        console.error(err);
    }
}