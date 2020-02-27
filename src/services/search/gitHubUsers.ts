import axios from "axios"
import { Client } from "pg";

export const getUser = async (username: string) => {
    const url = `https://api.github.com/users/${username}`;
    // async call to external API with header to request version 3 of the API as recommended by GitHub documentation
    try {
        console.log("trying url: " + url)

        const token = Buffer.from(`mmerdanovic:Rumian2502!!`, 'utf8').toString('base64')

        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${token}`
            }
        })
        console.log("SUCCESS")

        // if http request was a success, extract needed data and pack into response for client
        if (response && response.status == 200) {
            const queryText = "SELECT searchedforcounter FROM users WHERE username = '" + username + "'"

            let currentUserCounter = 0;

            const client = new Client()
            await client.connect()
            try {
                console.log("querying DB for searchcounter")
                const res = await client.query(queryText)
                console.log(res.rowCount);
                currentUserCounter = res.rows.length > 0 ? res.rows[0].searchedforcounter : 0;
                console.log("currentuserCounter: " + currentUserCounter);
                await client.end()
            } catch (error) {
                console.error(error);
            }
            const payload = response.data;
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