import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";

// Cross origin resource sharing - allows fetching restricted resources from a domain outside the one initially requested
export const handleCors = (router: Router) =>
    router.use(cors({ credentials: true, origin: true }));

// For handling HTTP POST (required by Express)
export const handleBodyRequestParsing = (router: Router) => {
    router.use(parser.urlencoded({ extended: true }));
    router.use(parser.json());
};
// Apply compression to responses
export const handleCompression = (router: Router) => {
    router.use(compression());
};