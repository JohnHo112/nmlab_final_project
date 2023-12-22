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
import { createIdentity } from "../iota_function/create_did";
import { createVP } from "../iota_function/create_vp";

const wrap =
  (fn: any) =>
  (...args: any) =>
    fn(...args).catch(args[2]);

let storage:any;
let didClient:any;
let holderDocument:any;

function main(app: any) {
  app.post("/api/createDID", async (req: any, res: any) =>  {
    console.log("req: ",req.body)
    const VM = req.body.verificationMethod;
    const DID =  await createIdentity(VM)
    storage = DID.storage;
    didClient = DID.didClient;
    holderDocument = DID.document;
    res.send(DID)
  });
  // app.get("/api/checkVP", wrap(checkVPRoute));
  // app.get("/api/loadDID", wrap(loadDIDRoute));
  // app.post("/api/revokeVC", wrap(revokeVCRoute));
  // app.get("/api/VC", wrap(VCRoute));
  app.get("/api/VP", async (req: any, res: any) => {
    const data = req.query;
    const holderDID = data.holderDID;
    const credentialFile = data.credentialFile;
    const fragment = data.fragment;
    const challenge = data.challenge;
    console.log("VP data: ", data)
    // const verificationMethodFragment = data.verificationMethodFragment
    // const verificationMethodFragment = "";
    const message = await createVP(
      holderDID,
      credentialFile,
      fragment,
      challenge,
      storage,
      didClient,
      holderDocument
    );
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
