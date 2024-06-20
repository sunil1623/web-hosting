import { AmplifyClient, UpdateBranchCommand, UpdateBranchCommandInput } from "@aws-sdk/client-amplify";

export const updateBranch = async (input:UpdateBranchCommandInput) =>{
    try {
        const amplifyClient =  new AmplifyClient({
            region: `${process.env.W_AWS_REGION}` ?? "",
            credentials: {
                accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
                secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
            } 
        });
        const command = new UpdateBranchCommand(input);
        const branchData = await amplifyClient.send(command);
        
        if(branchData.$metadata.httpStatusCode !== 200){
            return console.error("Error updating Branch");
        }

        return branchData.branch;
    } catch (err) {
        console.error(err);
    }
}