import * as React from "react";
import { useState, useEffect, CSSProperties } from "react";
import "../css/main_dialog.css";
import background from "../assets/200.gif";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import CloseIcon from "@mui/icons-material/Close";
import { Verify } from "../api";
// import IconButton from "@mui/material/IconButton";
import BarLoader from "react-spinners/BarLoader";

const MainDialog = () => {
  const [challenge, setChallenge] = useState("");
  const [files, setFiles] = useState("");
  const [fileName, setFileName] = useState("");
  const [verified, setVerified] = useState("Not Verified");
  // const [tutorial, setTutorial] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const target = e.target as HTMLInputElement;

    if (!target.files) return;
    setFileName(target.files[0].name);
    fileReader.readAsText(target.files[0], "UTF-8");

    fileReader.onload = () => {
      setFiles(fileReader.result as string);
    };
  };

  const handleVerify = () => {
    try {
      setLoading(true);

      Verify(files, challenge).then((res) => {
        setVerified(res);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      alert("Some Error Occured!");
      setLoading(false);
    }
  };

  const generate_challenge = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=+?^_!#$%&";
    const charactersLength = characters.length;
    let result = "";

    // Create an array of 32-bit unsigned integers
    const randomValues = new Uint32Array(length);

    // Generate random values
    window.crypto.getRandomValues(randomValues);
    randomValues.forEach((value) => {
      result += characters.charAt(value % charactersLength);
    });

    setChallenge(result);
  };

  const override: CSSProperties = {
    // display: "in-line",
    margin: "0 auto",
    borderColor: "white",
  };

  const Loader = () => {
    return (
      <>
        <p
          style={{
            fontSize: "18px",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
          Verifying...
        </p>
        <BarLoader
          color="white"
          loading={loading}
          height={5}
          width={150}
          cssOverride={override}
        />
      </>
    );
  };

  const MainPage = () => {
    return (
      <>
        <p className="dialog__text">
          Challenge:
          <p className="dialog__out__text">
            {challenge ? challenge : "No Challenge Generated"}
          </p>
          <button
            className="dialog__button"
            onClick={() => generate_challenge(20)}>
            Generate Challenge
          </button>
        </p>
        <p className="dialog__text">
          File:
          <p className="dialog__out__text">
            {fileName ? fileName : "No File Uploaded"}
          </p>
          <p className="dialog__out__text">
            <label className="dialog__fileButton">
              Upload Presentation File
              <input type="file" accept=".json" onChange={handleChange} hidden />
            </label>
          </p>
        </p>
        <p className="dialog__text">
          Status:
          <p className="dialog__out__text">
            {loading ? <Loader /> : verified}
          </p>
          <button className="dialog__button" onClick={handleVerify}>
            Verify
          </button>
        </p>

      </>
    );
  };

  // const TutorialPage = () => {
  //   return (
  //     <>
  //       <p className="tutorial__title">
  //         Step 1 : <br />{" "}
  //       </p>
  //       <p className="tutorial__text">
  //         Click "Generate Challenge" to get a random challenge.
  //         <br />
  //         <br />
  //         (Showed in "Challenge" field.)
  //       </p>
  //       <p className="tutorial__title">
  //         Step 2 : <br />
  //       </p>
  //       <p className="tutorial__text">
  //         Go to Holder, generate a presentation file with this challenge.
  //       </p>
  //       <p className="tutorial__title">
  //         Step 3 : <br />
  //       </p>
  //       <p className="tutorial__text">
  //         Upload the presentation file (Click "Upload Presentation File").
  //         <br />
  //         <br />
  //         If upload successfully, you can see the file name in "File" field.
  //       </p>
  //       <p className="tutorial__title">
  //         Step 4 : <br />
  //       </p>
  //       <p className="tutorial__text">
  //         Click "Verify" to verify your identity.
  //         <br />
  //         <br />
  //         The result would show up in "Status" field.
  //       </p>
  //     </>
  //   );
  // };

  useEffect(() => {
    setVerified("Not Verified");
  }, [challenge, files]);

  useEffect(() => {
    setFileName("");
    setFiles("");
  }, [challenge]);

  return (
    <>
      <div className="page">
        <img
            src={background}
            alt="background image"
            className="background__img"
          />
        <div className="dialog__form">
          <div className="grid-container">
            <div />
            <h1 className="dialog__title">
              Verifier
              {/* {tutorial ? "Tutorial" : "Verifier"} */}
            </h1>
            <div className="dialog__iconbutton">
            </div>
          </div>
            <MainPage />
          {/* {tutorial ? <TutorialPage /> : <MainPage />} */}
        </div>
      </div>
    </>
  );
};

export default MainDialog;
