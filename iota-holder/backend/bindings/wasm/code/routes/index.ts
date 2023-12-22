// import createDIDRoute from "./createDID";
// import checkVPRoute from "./checkVP";
// import loadDIDRoute from "./resolveDID";
// import revokeVCRoute from "./Revo";
// import VCRoute from "./VC";
// import VPRoute from "./VP";
// import VMRoute from "./VM";
// import DownloadFileRoute from "./DownloadFile";
import uploadFileRoute from "./uploadFile";
// import downloadVPRoute from "./downloadVP";
// import checkUsrNameRoute from "./checkUsrName";
// import removeFileRoute from "./removeFile";
import getUserStorageRoute from "./getUserStorage";
import { createDid } from "../iota_function/create_did";
import { createVP } from "../iota_function/create_vp";

import { type Address, AliasOutput, Client, MnemonicSecretManager, SecretManager, Utils, SecretManagerType, IRent } from "@iota/sdk-wasm/node";
import { API_ENDPOINT, ensureAddressHasFunds} from "../util";

const wrap =
  (fn: any) =>
  (...args: any) =>
    fn(...args).catch(args[2]);

const client = new Client({
  primaryNode: API_ENDPOINT,
  localPow: true,
});

let holderStorage:any;
let holderSecretManager:any;
let holderDocument:any;

function main(app: any) {
  app.post("/api/createDID", async (req: any, res: any) =>  {
    const VM = req.body.verificationMethod;
    const {address, document, fragment, storage} = await createDid(VM, client);
    holderStorage = storage;
    holderDocument = document;
    console.log("----create holder did succ----");
    console.log(holderDocument.id().toString());
    const holderDid = holderDocument.id().toString();
    res.send(holderDid);
  });
  // app.get("/api/checkVP", wrap(checkVPRoute));
  // app.get("/api/loadDID", wrap(loadDIDRoute));
  // app.post("/api/revokeVC", wrap(revokeVCRoute));
  // app.get("/api/VC", wrap(VCRoute));
  app.get("/api/VP", async (req: any, res: any) => {
    // const holderDid = req.body.holderDID;
    // const credentialFile = req.body.credentialFile;
    // const holderFragment = req.body.fragment;
    // const challenge = req.body.challenge;
    const data = req.query;
    const holderDid = data.holderDID;
    const credentialFile = data.credentialFile;
    const holderFragment = data.fragment;
    const challenge = data.challenge;
    console.log("req: \n" + holderDid + "\n" + credentialFile + "\n" +holderFragment + "\n" +challenge);

    const message = await createVP(client, holderStorage, credentialFile, holderDocument, holderFragment, challenge);
    console.log("message: ", message);
    res.send(message);
  });
  // app.get("/api/downloadSH", wrap(DownloadFileRoute));
  app.post("/api/uploadFile", wrap(uploadFileRoute));
  // app.get("/api/downloadVP", wrap(downloadVPRoute));
  // app.post("/api/checkUsrName", wrap(checkUsrNameRoute));
  // app.post("/api/VM", wrap(VMRoute));
  // app.post("/api/removeFile", wrap(removeFileRoute));
  app.get("/api/getStorage", wrap(getUserStorageRoute));
}

export default main;
