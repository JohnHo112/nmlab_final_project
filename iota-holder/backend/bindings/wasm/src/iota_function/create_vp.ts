// Copyright 2020-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {
    CoreDID,
    Credential,
    Duration,
    EdDSAJwsVerifier,
    FailFast,
    IotaIdentityClient,
    JwkMemStore,
    JwsSignatureOptions,
    JwsVerificationOptions,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    JwtPresentationOptions,
    JwtPresentationValidationOptions,
    JwtPresentationValidator,
    KeyIdMemStore,
    Presentation,
    Resolver,
    Storage,
    SubjectHolderRelationship,
    Timestamp,
    IotaDocument,
    Jwt,
} from "@iota/identity-wasm/node";
import { resolveIdentity } from "./resolve_did";
import * as path from 'path'
import { readFileSync } from 'fs'

/**
 * This example shows how to create a Verifiable Presentation and validate it.
 * A Verifiable Presentation is the format in which a (collection of) Verifiable Credential(s) gets shared.
 * It is signed by the subject, to prove control over the Verifiable Credential with a nonce or timestamp.
 */
export async function createVP(
    holderDID:string,
    credentialFile:any,
    holderFragment:string,
    challenge:string,
    holderStorage:any,
    didClient:any,
    holderDocument: IotaDocument) {

    // ===========================================================================
    // Holder creates a verifiable presentation from the issued credential for the verifier to validate.
    // ===========================================================================

    // Create a Verifiable Presentation from the Credential
    console.log("Creating Verifiable Presentation...");
    // const filePath = path.join('../vc', credentialFile)
    // const verifiableCredential = JSON.parse(readFileSync(filePath, 'utf-8'))
    // console.log("read file successfully~");
    const filePath = path.join('/Users/angelhsia/Downloads', credentialFile)
    const verifiableCredential = JSON.parse(readFileSync(filePath, 'utf-8'))
    console.log("read file successfully~");
    const credentialJwt = await new Jwt(verifiableCredential)
    console.log("credentialJwt: ", credentialJwt)
    
    const unsignedVp = await new Presentation({
        holder: holderDID,
        verifiableCredential: [credentialJwt],
    });

    // Create a JWT verifiable presentation using the holder's verification method
    // and include the requested challenge and expiry timestamp.

    const expires = Timestamp.nowUTC().checkedAdd(Duration.minutes(30));
    const presentationJwt = await holderDocument.createPresentationJwt(
        holderStorage,
        holderFragment,
        unsignedVp,
        new JwsSignatureOptions({ nonce: challenge}),
        new JwtPresentationOptions({ expirationDate: expires }),
    );

    console.log(
        `unsignedVp: `,
        unsignedVp.toJSON(),
    );

    // for testing purposes
    // ===========================================================================
    // Step 7: Verifier receives the Verifiable Presentation and verifies it.
    // ===========================================================================

    // The verifier wants the following requirements to be satisfied:
    // - JWT verification of the presentation (including checking the requested challenge to mitigate replay attacks)
    // - JWT verification of the credentials.
    // - The presentation holder must always be the subject, regardless of the presence of the nonTransferable property
    // - The issuance date must not be in the future.

    const jwtPresentationValidationOptions = new JwtPresentationValidationOptions(
        {
            presentationVerifierOptions: new JwsVerificationOptions({ nonce: challenge }),
        },
    );
    console.log("1")

    const resolver = new Resolver({
        client: didClient,
    });
    console.log("2")
    // Resolve the presentation holder.
    const presentationHolderDID: CoreDID = JwtPresentationValidator.extractHolder(presentationJwt);
    console.log("3")
    const resolvedHolder = await resolver.resolve(
        presentationHolderDID.toString(),
    );
    console.log("4")
    console.log("presentationJwt: ", presentationJwt)
    console.log("resolvedHolder: ", resolvedHolder)
    console.log("jwtPresentationValidationOptions: ", jwtPresentationValidationOptions)

    // Validate presentation. Note that this doesn't validate the included credentials.
    let decodedPresentation = new JwtPresentationValidator(new EdDSAJwsVerifier()).validate(
        presentationJwt,
        resolvedHolder,
        jwtPresentationValidationOptions,
    );
    console.log("5")

    // Validate the credentials in the presentation.
    let credentialValidator = new JwtCredentialValidator(new EdDSAJwsVerifier());
    console.log("6")
    let validationOptions = new JwtCredentialValidationOptions({
        subjectHolderRelationship: [
            presentationHolderDID.toString(),
            SubjectHolderRelationship.AlwaysSubject,
        ],
    });
    console.log("7")

    let jwtCredentials: Jwt[] = decodedPresentation
        .presentation()
        .verifiableCredential()
        .map((credential) => {
            const jwt = credential.tryIntoJwt();
            if (!jwt) {
                throw new Error("expected a JWT credential");
            } else {
                return jwt;
            }
        });
    console.log("8")

    // Concurrently resolve the issuers' documents.
    let issuers: string[] = [];
    for (let jwtCredential of jwtCredentials) {
        let issuer = JwtCredentialValidator.extractIssuerFromJwt(jwtCredential);
        issuers.push(issuer.toString());
    }
    console.log("9")
    let resolvedIssuers = await resolver.resolveMultiple(issuers);
    console.log("10")
    // Validate the credentials in the presentation.
    for (let i = 0; i < jwtCredentials.length; i++) {
        credentialValidator.validate(
            jwtCredentials[i],
            resolvedIssuers[i],
            validationOptions,
            FailFast.FirstError,
        );
    }
    console.log("11")

    // Since no errors were thrown we know that the validation was successful.
    console.log(`VP successfully validated`);
    return (presentationJwt)
}
