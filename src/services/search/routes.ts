import { Request, Response } from "express";
import { callGetUser } from "./SearchController";

export default [
    {
        path: "/api/v1/search/users/:username",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                // extract username from URL
                const stringPath = req.originalUrl.toString();
                const splitPath = stringPath.split("/");
                const username = splitPath[splitPath.length - 1];
                // feed extracted username into external API call
                const result = await callGetUser(username);
                res.status(200).send(result);
            }
        ]
    }, 
    {// handle null username - can be omitted to get a "Method not found" error instead
        path: "/api/v1/search/users",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                
                res.status(400).send({
                    user: {}, 
                    statusCode: 400, 
                    errorMessage: "No username provided"
                });
            }
        ]
    }
];