const {
  Jwk,
  JwkType,
  EdCurve,
  MethodScope,
  IotaDocument,
  VerificationMethod,
  Service,
  MethodRelationship,
  IotaIdentityClient,
} = require('@iota/identity-wasm/node');
const { Client } = require('@iota/sdk-wasm/node');

/**
 * Adds a verification method to a DID Document and publishes it to the tangle.
 *
 * @param name Name of DID holder to locate Stronghold file in `/stronghold-files/<name>.hodl`.
 * @param password Stronghold password.
 * @param fragment Fragment of new verifcation method.
 */
async function addVerificationMethod(
  did:any,
  fragment: string
) {
  // const account: Account = await resolveIdentity(did);
  // console.log("Creating Method...");

  // await account.createMethod({
  //   content: MethodContent.GenerateEd25519(),
  //   fragment,
  // });

  // console.log("Creating Method Successful!");
  // console.log(
  //   `Explorer Url:`,
  //   ExplorerUrl.mainnet().resolverUrl(account.did())
  // );
  // return "Creating Method Successful!";
}

export { addVerificationMethod };
