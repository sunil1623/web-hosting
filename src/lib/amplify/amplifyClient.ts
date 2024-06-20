import { AmplifyClient } from "@aws-sdk/client-amplify";

const amplifyClient:AmplifyClient =  new AmplifyClient({
    region: `${process.env.W_AWS_REGION}` ?? "",
    credentials: {
        accessKeyId: `${process.env.W_AWS_ACCESS_KEY}` ?? "",
        secretAccessKey: `${process.env.W_AWS_SECRET_KEY}` ?? ""
    } 
});

export default amplifyClient;
