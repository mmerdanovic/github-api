# Github-api
Dockerized Node + typescript API that returns github user data and tracks popularity based on calls to this API.

## Requirements

`docker`

`docker-compose.yml` and `init.sql` both provided in the root directory of this project.

## Install

Navigate to the project root directory of your git clone and perform:

    docker-compose pull

## Run the app

    docker-compose up

## Get user information from github

### Request

`GET /api/v1/search/users/:username`

    curl localhost:42069/api/v1/search/users/<username>

### Response

    {
        "user":{
            "username":"alex",
            "email":null,
            "searchedForCounter":7,
            "followers":5190,
            "followed":38
        },
        "statusCode":200,
        "errorMessage":""
    }

## Get top searched users and sort by number of followers

`limit` parameter defines how many records the method returns, type `number`. If `limit` is omitted, the entire list will be returned.

### Request

`GET /api/v1/search/users/mostSearched`

    curl localhost:42069/api/v1/search/users/mostSearched?limit=3

### Response

    {
        "usersByPopularity":[
            {
                "username":"alex",
                "email":null,
                "searchedForCounter":5,
                "followers":5190,
                "followed":38
            },
            {
                "username":"michael",
                "email":null,
                "searchedForCounter":3,
                "followers":590,
                "followed":82
            },
            {
                "username":"mmerdanovic",
                "email":"mmerda2502@gmail.com",
                "searchedForCounter":0,
                "followers":0,
                "followed":0
            }
        ],
        "statusCode":200,
        "errorMessage":""
    }

## Reset all searchedForCounters to 0

### Request

`DELETE /api/v1/search/users/mostPopular`

    curl -X "DELETE" localhost:42069/api/v1/search/users/mostPopular

### Response

    {
        "message": "Popularity counters successfully reset."
    }

## Search without a provided username

### Request

`GET /api/v1/search/users/`

    curl localhost:42069/api/v1/search/users/

### Response

    {
        "user":{

        },
        "statusCode":400,
        "errorMessage":"No username provided"
    }

## Search with an invalid username

### Request

`GET /api/v1/search/users/-invalid`

    curl localhost:42069/api/v1/search/users/-invalid

### Response

    {
        "user":{

        },
        "statusCode":400,
        "errorMessage":"Please provide a valid GitHub username (1-39 alphanumeric characters long, non-leading '-' is permitted"
    }

## Notes
Github API has a limit of 60 calls/hr if a user is not authenticated via HTTPBasicAuthentication or OAuth token. This app works fine without a provided login, but for safety it is best to provide a basicAuth login. You can do this by setting the `ENABLE_GIT_AUTH` environment variable located in `.env` of the root directory to `"true"` and inputing your username and password in the `GIT_USERNAME` `GIT_PASSWORD` variables. In case auth is set to true, but no credentials are provided, API will perform the call without authentication. In addition, Github API will always return null for "email" if no authentication is provided. This seems to be a bug in the GitHub API.
