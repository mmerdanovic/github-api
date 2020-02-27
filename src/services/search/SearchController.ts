import { getUser } from "./gitHubUsers";
import { Client } from "pg";

export const validUsernameRegex = /^[^-][a-zA-Z0-9-]{1,39}$/

export const resetPopularity = async () => {

    const queryText = "UPDATE users SET searchedForCounter=0";
    // execute query, no failsafe
    const client = new Client()
    await client.connect()

        const res = await client.query(queryText)

    await client.end()
    console.log(res)

    return {
        message: "Popularity counters successfully reset."
    };
}

export const callGetUser = async (username: string) => {

    //check if username matches formatting criteria
    if (!validUsernameRegex.test(username)) {
        console.log("invalid username format");
        //if it doesnt, return a custom error message with formatting details
        return {
            user: {},
            statusCode: 400,
            errorMessage: "Please provide a valid GitHub username (1-39 alphanumeric characters long, non-leading '-' is permitted"
        };
    }
    // if username is formatted correctly, perform call to external API
    const response = await getUser(username);

    if (response.statusCode == 200) {
        // if user was found on github, insert into table if it's not already there otherwise increment searchedForCounter (done through SQL statement)
        console.log("incrementing search counter for: " + username)
        const query = "INSERT INTO users (username, searchedforcounter) VALUES ('" + username + "', 1)" +
            " ON CONFLICT (username) DO UPDATE" +
            " SET searchedforcounter = users.searchedforcounter + 1;"

        const client = new Client()
        client.connect()
        client.query(query, (err, res) => {
            if (err) throw err
            client.end()
        })
    }
    return response;
};

export const getUsersByPopularity = async (limit: number) => {

    console.log("limit param inside handler: " + limit)

    // handle you trying to break my api on purpose
    if (isNaN(limit)) {
        console.log("Limit was not a number, setting default")
        limit = 0;
    }

    // if no limit parameter was sent, form query without LIMIT
    const queryText = "SELECT * FROM users " + (limit ? "LIMIT $1" : "");


    // declare in parent scope so we can fill it inside query callback fn
    let userList: any[] = [];

    const client = new Client()
    await client.connect()
    // execute query without limit param if none is present
    const res = limit ? (await client.query(queryText, [limit])) : (await client.query(queryText))
    userList = JSON.parse(JSON.stringify(res.rows))
    await client.end()


    console.log("userlist outside");
    console.log(userList);

    let packedResponseArray = [];

    // prepare object structure as defined in the document

    for (let i = 0; i < userList.length; i++) {
        const currentUserResponse = await getUser(userList[i].username);
        // if you successfully got user, push into array. if not, push template with known data
        if (currentUserResponse.statusCode == 200) {
            packedResponseArray.push(currentUserResponse.user)
        } else {
            packedResponseArray.push({
                username: userList[i].username,
                email: null,
                searchedForCounter: userList[i].searchedforcounter,
                followers: null,
                followed: null
            })
        }
    }

    // sort array by number of followers, put "nulls" at bottom <-- should never happen
    const sortedArray = packedResponseArray.sort((n1, n2) => {
        if (n1.followers > n2.followers || n2.followers == null) {
            return -1;
        }

        if (n1.followers < n2.followers || n1.followers == null) {
            return 1;
        }

        return 0;
    });

    console.log("sorted array");
    console.log(sortedArray);

    const response = {
        usersByPopularity: sortedArray,
        statusCode: 200,
        errorMessage: ""
    }

    return response;

}