import { addVerificationMethod } from "../iota_function/verificationMethods";
const VMRoute = async (req: any, res: any) => {
  console.log("req.body", req.body);
  const body = req.body;
  const userDID = body.userDID;
  const fragment = body.fragment;
  const message = await addVerificationMethod(userDID, fragment);
  console.log(message);
  res.send(message);
};
export default VMRoute;
