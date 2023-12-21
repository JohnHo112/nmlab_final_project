// Copyright 2020-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {
    Jwk,
    JwkType,
    EdCurve,
    VerificationMethod,
    Service,
    MethodRelationship,
    IotaDID,
    IotaDocument,
    IotaIdentityClient,
    JwkMemStore,
    JwsAlgorithm,
    KeyIdMemStore,
    MethodScope,
    Storage,
} from "@iota/identity-wasm/node";
import { AliasOutput, Client, MnemonicSecretManager, SecretManager, Utils } from "@iota/sdk-wasm/node";
import { API_ENDPOINT, ensureAddressHasFunds } from "../util";
const EXAMPLE_JWK = new Jwk({
    kty: JwkType.Okp,
    crv: EdCurve.Ed25519,
    x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
  });
  
/** Demonstrate how to create a DID Document and publish it in a new Alias Output. */
export async function test() {
    // Create a new client with the given network endpoint.
  const client = new Client({
    primaryNode: API_ENDPOINT,
    localPow: true,
  });

  const didClient = new IotaIdentityClient(client);

  // Get the Bech32 human-readable part (HRP) of the network.
  const networkHrp = await didClient.getNetworkHrp();

  // Create a new DID document with a placeholder DID.
  // The DID will be derived from the Alias Id of the Alias Output after publishing.
  const document = new IotaDocument(networkHrp);
  console.log("document 1: " , document)

  // Insert a new Ed25519 verification method in the DID document.
  const method = VerificationMethod.newFromJwk(
    document.id(),
    EXAMPLE_JWK,
    "#key-1"
  );
  document.insertMethod(method, MethodScope.VerificationMethod());
  console.log("document 2.0: " , document)

  const method2 = VerificationMethod.newFromJwk(
    document.id(),
    EXAMPLE_JWK,
    "#key-2"
  );
  document.insertMethod(method2, MethodScope.VerificationMethod());
  console.log("document 2.5: " , document)

  // Attach a new method relationship to the existing method.
  document.attachMethodRelationship(
    document.id().join("#key-1"),
    MethodRelationship.Authentication
  );

  console.log("document 3: " , document)

  // Add a new Service.
  const service = new Service({
    id: document.id().join("#linked-domain"),
    type: "LinkedDomains",
    serviceEndpoint: "https://iota.org/",
  });
  document.insertService(service);

  console.log(`Created document `, JSON.stringify(document.toJSON(), null, 2));
}
