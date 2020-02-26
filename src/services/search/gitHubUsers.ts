import axios from "axios"

export const getUser = async (username: string) => {
    const url = `https://api.github.com/users/${username}`;
    // async call to external API with header to request version 3 of the API as recommended by GitHub documentation
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        // if http request was a success, extract needed data and pack into response for client
        if (response && response.status == 200) {
            const payload = response.data;
            return {
                user: {
                    username: username,
                    email: payload.email,
                    followers: payload.followers,
                    followed: payload.following
                },
                statusCode: 200,
                errorMessage: ""
            };
        } // if http request was a failure, return errorCode and errorMessage (if) provided by external API
        else if (response){
            return {
                user: {},
                statusCode: response.status,
                errorMessage: response.statusText
            }
        } // else just return 500
        else {
            return {
                user: {},
                statusCode: 500,
                errorMessage: "Internal server error"
            }
        }
    } catch(error) {
        return {
            user: {},
            statusCode: 500,
            errorMessage: "Internal server error"
        }
    }
};