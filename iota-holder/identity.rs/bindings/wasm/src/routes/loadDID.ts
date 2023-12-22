import { resolveIdentity } from "../iota_function/resolve_did";
const loadDIDRoute = async (req: any, res: any) => {
  // const data = req.query;
  // const name = data.name;
  // const password = data.password;
  const did = req.body.did;
  const account = await resolveIdentity(did);
  console.log("Resolved DID document: ", account);
  res.send(account);
};
export default loadDIDRoute;
