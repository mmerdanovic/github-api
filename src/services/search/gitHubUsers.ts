import axios from "axios"
import { Client } from "pg";

export const getUser = async (username: string) => {
    const url = `https://api.github.com/users/${username}`;
    // async call to external API with header to request version 3 of the API as recommended by GitHub documentation
    try {
        console.log("trying url: " + url)

        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        if (process.env.ENABLE_GIT_AUTH == "true" && process.env.GIT_USERNAME !== "" && process.env.GIT_PASSWORD !== "") {

            console.log("Github basic authentication ENABLED, setting secret login");

            const token = Buffer.from(process.env.GIT_USERNAME + ":" + process.env.GIT_PASSWORD, 'utf8').toString('base64')
            const headers = {
                'Accept': 'application/vnd.github.v3+json', 
                'Authorization': 'Basic ${token}'
            };
        } else {
            console.log("Github basic authentication DISABLED, proceeding without login");
        }

        const response = await axios.get(url, {
            headers: headers
        })
        console.log("SUCCESS")

        // if http request was a success, extract needed data and pack into response for client
        if (response && response.status == 200) {
            const queryText = "SELECT searchedforcounter FROM users WHERE username = '" + username + "'"

            let currentUserCounter = 0;

            const client = new Client()
            await client.connect()
            try {
                // find how many times user was RETURNED by API
                console.log("querying DB for searchcounter")
                const res = await client.query(queryText)
                // if you cant find user, 0 counter means "we have never found this user before"
                currentUserCounter = res.rows.length > 0 ? res.rows[0].searchedforcounter : 0;
                console.log("currentuserCounter: " + currentUserCounter);
                await client.end()
            } catch (error) {
                console.error(error);
            }
            const payload = response.data;
            // return planned object structure
            return {
                user: {
                    username: username,
                    email: payload.email,
                    searchedForCounter: currentUserCounter,
                    followers: payload.followers,
                    followed: payload.following
                },
                statusCode: 200,
                errorMessage: ""
            };
        } // if http request was a failure, return errorCode and errorMessage (if) provided by external API
        else if (response) {
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
    } catch (error) {
        console.log("Failed" + error)
        return {
            user: {},
            statusCode: error.response.status,
            errorMessage: error.response.statusText
        }
    }
};