// Copyright 2020-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { IotaDocument } from "@iota/identity-wasm/node";
import { AliasOutput } from "@iota/sdk-wasm/node";

/** Demonstrates how to resolve an existing DID in an Alias Output. */
export async function resolveIdentity(did:any, didClient:any) {
    // Resolve the associated Alias Output and extract the DID document from it.
    const resolved: IotaDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(resolved, null, 2));

    // We can also resolve the Alias Output directly.
    const aliasOutput: AliasOutput = await didClient.resolveDidOutput(did);
    console.log("The Alias Output holds " + aliasOutput.getAmount() + " tokens");

    return (resolved)
}
