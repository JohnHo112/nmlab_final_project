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

export default function GetDID(){
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [toggleWord, setToggleWord] = useState("show");
    // const [passwordType, setPasswordType] = useState("password");
    const [iotaDID, setIotaDID] = useState("");
    const [DIDDocument, setDIDDocument] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleIotaDID = (e) => {
        setIotaDID(e.target.value);
    };
    
    const handleLogin = (e) => {
        setLoading(true);
        setErrorMessage("")
        if(iotaDID===""){
            setErrorMessage("Please enter your did!");
            setLoading(false);
        }else{

            instance
            .get("/loadDID", { did: iotaDID })
            .then((res) => {
                console.log("res: ", res.data);
                setDIDDocument(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage("Something went wrong!");
                setLoading(false);
            });
            // instance
            // .post("/checkUsrName",{
            //     usrname: username,
            // })
            // .catch((err) => {
            //     console.log(err);
            //     setErrorMessage("Something wrong!");
            // })
            // .then((res)=>{
            //     if(res.data!=="Exist"){
            //         setErrorMessage("User does not exist!");;
            //     }
            //     console.log(res)
            //     if(res.data==="Exist"){
            //         console.log(res.data)
            //         instance
            //         .get("/loadDID", { params: { name: username, password: password } })
            //         .then((res) => {
            //             console.log(res);
            //             setIotaDID(res.data);
            //             setLoading(false);
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //             setErrorMessage("Something wrong!");
            //             setLoading(false);
            //         });
            //     }else{
            //         setLoading(false);
            //     }
            // })
            
        }
    };
    return(
        <div id="login">
            <Card style={{ width: '25rem' }} className="DID_card">
                <Container className='login_container'>
                <Form>
                    <Form.Group className="mb-3" controlId="user name">
                        <Form.Label>Iota DID</Form.Label>
                        <Form.Control type="text" placeholder="did" id="input-bordered" value={iotaDID} onChange={handleIotaDID} />
                    </Form.Group>
                    <Form.Group>
                        <div className="text-center align-items-center">
                            <button type="button" className="btn btn-outline-light" onClick={handleLogin} disabled={loading} style={{height: "40px", width:'10rem'}}>
                                {loading ? <p>Getting...</p> : <p>Get</p>}
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
                        {(DIDDocument!=="") ?
                        <div>
                            {/* <p>Download Your Stronghold File: </p>
                            <button id="download" className="btn btn-light" onClick={downloadSH}>Download</button> */}
                            <p>Your DID document: </p>
                            <JsonView id="json-word" data={DIDDocument} shouldInitiallyExpand={(level) => true} style={defaultStyles} />
                        </div>:
                        <div>
                            <h1>
                                Get Digital Identity
                            </h1>
                            <p>
                                1. Enter your did.<br/><br/>
                                2. Press the "Get" Bottom.<br/><br/>
                            </p>
                        </div>
                        }
                </Card>
            </div>
        </div>

    )

}