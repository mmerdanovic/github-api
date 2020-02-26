import { getUser } from "./gitHubUsers";

export const callGetUser = async (username: string) => {
    const validUsernameRegex = /^[^-][a-zA-Z0-9-]{1,39}$/
    //check if username matches formatting criteria
    if (!validUsernameRegex.test(username)) {
        //if it doesnt, return a custom error message with formatting details
        return {
            user: {},
            statusCode: 400,
            errorMessage: "Please provide a valid GitHub username (1-39 alphanumeric characters long, non-leading '-' is permitted"
        };
    }
    // if username is formatted correctly, perform call to external API
    const response = await getUser(username);

    return response;
};