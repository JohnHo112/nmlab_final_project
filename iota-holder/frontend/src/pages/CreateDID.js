import React, { useState } from 'react';
import instance from "../api";
import Card from 'react-bootstrap/Card';
import { JsonView,  defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import downloadFile from "../downloadFileAPI";
import FileDownload from "js-file-download";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import img_hide from '../images/hide.png'
import img_view from '../images/view.png'


export default function CreateDID(){
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationMethod, setVerificationMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [iotaDID, setIotaDID] = useState("");

    const handleLogin = async (e) => {
        setLoading(true);
        setIotaDID("");
        if(verificationMethod===""){
            setErrorMessage("Please enter verification method!");
            setLoading(false);
        }else{
            console.log("creating DID...");
                instance
                .post("/createDID", {verificationMethod: verificationMethod})
                .then((res) => {
                    const didId = res.data.did;
                    console.log("DID id: ", didId);
                    setIotaDID(didId);
                    setLoading(false);
                    console.log("DID created successfully!");
                })
                .catch((err) => {
                    setErrorMessage("Something went wrong with creating DID. Please try again later.");
                    console.log(err);
                });
        }
    };

    const handleVM = (e) => {
        setVerificationMethod(e.target.value);
    };
    
    return(
        <div id="login">
            <Card style={{ width: '15rem' }} className="DID_card">
                <Container className='login_container'>
                <Form>
                    <Form.Group className="mb-3" controlId="verification method">
                        <Form.Label>Verification Method</Form.Label>
                        <Form.Control type="text" placeholder="fragment" id="input-bordered" value={verificationMethod} onChange={handleVM} /> 
                    </Form.Group>
                    <Form.Group>
                        <div className="text-center align-items-center">
                            <button type="button" className="btn btn-outline-light" onClick={handleLogin} disabled={loading} style={{height: "40px", width:'10rem'}}>
                                {loading ? <p>Creating...</p> : <p>Create Your DID</p>}
                            </button>
                        </div>
                    </Form.Group>
                </Form>
                </Container>
            </Card>
            <div id="errorMessage">
                <p>{errorMessage}</p>
            </div>
            <div id="DID">
                <Card id="display-card">
                    {(iotaDID!=="" && iotaDID!=="Repeat") ?
                    <div>
                        <p>Your DID document: </p>
                        <JsonView id="json-word" data={iotaDID} shouldInitiallyExpand={(level) => true} style={defaultStyles} />
                    </div>
                    :
                    <div>
                        <h1>Create Digital Identity</h1>
                        <p >
                        1. Fragment should not be blank.<br/><br/>
                        2. If you want more than one verification methods, please go to "Add Verification Method".<br/><br/>
                        3. It may take a little time to finish
                        </p>
                    </div>
                    }
                    </Card>
            </div>
        </div>

    )

}