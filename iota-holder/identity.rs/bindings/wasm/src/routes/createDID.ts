import { createIdentity } from "../iota_function/create_did";

const createDIDRoute = async (req: any, res: any) =>  {
  console.log("req: ",req.body)
  const VM = req.body.verificationMethod;
  const DID =  await createIdentity(VM)
  const storage = DID.storage;
  console.log("DID: ", DID)
  res.send(DID)
  return(storage)
}

export default createDIDRoute

