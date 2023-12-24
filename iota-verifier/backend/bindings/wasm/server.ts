const express = require("express");
const app = express();
const cors = require("cors");
const { verify } = require("./code/verify_vp.ts")
const { createVP } = require("./code/6_create_vp.ts")
import { Request, Response } from "express";

app.use(cors());
app.use(express.json());

// app.get("verify", async (req:any, res:any) => {
//     console.log("verify");
//     console.log(req.body);
//     const challenge = req.body.challenge
//     const presentationFile = req.body.presentationFile
//     const Verified = await verify_vp(presentationFile, challenge);
//     res.send(Verified)
//     console.log(Verified)
// });
export type getVerifiedRequest = {
    presentationFile: string,
    challenge: string
}

app.get("/verify", async (req:Request, res:Response) => {
    const { presentationFile, challenge } = req.query as getVerifiedRequest || { presentationFile: "", challenge: ""};
    console.log("presentationFile: ", presentationFile)
    console.log("challenge: ", challenge)
    const response = await verify(presentationFile, challenge);
    // const response = await createVP();
    res.send({ verified: response ? response : "",})
    console.log("verified: ", response)
});

app.listen(8000, () => {
    console.log("Your server is running on port 8000");
});