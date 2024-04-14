import "../../Styles.css";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import DisplayTextCard from "./DisplayTextCard.js";
import DisplayImageCard from "./DisplayImageCard.js";
import Loader from "./Loader.js";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

import axios from "axios";

// for draggable dialog box
const PaperComponent = (PaperProps) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...PaperProps} />
    </Draggable>
  );
};

const InputPage = () => {
  const [text, setText] = useState("");
  const [img_url, setImg_url] = useState("");
  const [img_name, setImg_name] = useState("");
  const [data, setData] = useState(null);
  const [filename, setFilename] = useState("");
  const [loaderFlag, setLoaderFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [tweetFlag, setTweetFlag] = useState(false);
  const validateTextfield = text.length > 0 ? true : false;
  let handleInputChange = (e) => setText(e.target.value);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [textFlag, setTextFlag] = useState(false);
  const [imgFlag, setImgFlag] = useState(false);

  const post_data = {
    text_msg: text,
    img_url: img_url,
    base64Image: img_url,
    img_name: img_name,
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const name = file["name"].split(".");
    setFilename(file["name"]);
    // console.log(file["name"] + " " + name[0]);
    const base64 = await convertBase64(file);
    setImg_name(name[0]);
    setImg_url(base64);
    console.log("Image Selected");
  };

  const checkButton = async (e) => {
    e.preventDefault();
    setLoaderFlag(true);
    console.log("Msg: " + text);
    await axios
      .post("http://localhost:5000/postdata", post_data)
      .then((response) => {
        const res = response.data;
        setData({
          text_classify: {
            toxicity: res.text.toxicity,
            severe_toxicity: res.text.severe_toxicity,
            obscene: res.text.obscene,
            threat: res.text.threat,
            insult: res.text.insult,
            identity_attack: res.text.identity_attack,
          },
          img_classify: res.img,
        });

        console.log(res);
        setLoaderFlag(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const postTweet = async (e) => {
    handleClose();
    e.preventDefault();
    console.log("Msg: " + text);
    await axios
      .post("http://localhost:5000/posttweet", { text: text, img: img_name })
      .then((response) => {
        const res = response.data;
        setTweetFlag(true);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data !== null) {
      let toxic = parseInt(data.text_classify["toxicity"].replace("%", ""));
      let severe_toxic = parseInt(
        data.text_classify["severe_toxicity"].replace("%", "")
      );
      let obscene = parseInt(data.text_classify["obscene"].replace("%", ""));
      let threat = parseInt(data.text_classify["threat"].replace("%", ""));
      let insult = parseInt(data.text_classify["insult"].replace("%", ""));
      let identity_attack = parseInt(
        data.text_classify["identity_attack"].replace("%", "")
      );
      if (
        toxic > 50 ||
        severe_toxic > 50 ||
        obscene > 50 ||
        threat > 50 ||
        insult > 50 ||
        identity_attack > 50
      ) {
        toast.error("Toxic Comment Detected !!", {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        setTextFlag(false);
      } else {
        toast.success("Your Comment is Safe for Word", {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        setTextFlag(true);
      }

      // Image Tostify
      let img = data.img_classify;
      if (img === "porn" || img === "sexy" || img === "hentai") {
        toast.error("NSFW Image Detected !!", {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        setImgFlag(false);
      } else if (img === "drawing" || img === "neutral") {
        toast.success("Your Image is Safe for Work", {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        setImgFlag(true);
      }
    }
  }, [data]);

  useEffect(() => {
    if (tweetFlag) {
      toast("Tweet Posted Successfully", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    }
    setTweetFlag(false);
  }, [tweetFlag]);

  return (
    <div className="AllStyles">
      {loaderFlag ? <Loader /> : null}
      <div className="bigcontainer">
        <div className="container">
          <div className="cardTitle">
            <h3>
              SafeGuard <TwitterIcon />
            </h3>
          </div>
          <div className="inputField">
            <TextField
              required
              id="outlined-required"
              label="Enter your Text"
              multiline
              maxRows={4}
              fullWidth
              className="input"
              onChange={handleInputChange}
            />
            <AwesomeButton
              type="primary"
              style={{ marginLeft: "10px", height: "55px", fontSize: "20px" }}
              onPress={checkButton}
              disabled={!validateTextfield}
            >
              Check
            </AwesomeButton>
          </div>

          <div>
            <label className="custom-file-upload">
              <input
                accept="image/*"
                className="input"
                id="contained-button-file"
                multiple
                type="file"
                onChange={uploadImage}
              />
              <AddPhotoAlternateRoundedIcon
                style={{
                  marginRight: "10px",
                  fontSize: "30px",
                  opacity: "0.5",
                }}
              />
            </label>
          </div>
          {filename && (
            <div className="fileName">
              Selected Image: <b>{filename}</b>
            </div>
          )}
          {((textFlag && data.img_classify === "No Image Selected") ||
            (textFlag && imgFlag)) && (
            <p className="postLink" onClick={handleClickOpen}>
              Do you want to Post??
            </p>
          )}

          <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              Post in Twitter
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Click on Post to send the Tweet in your Twitter Account. Make
                sure you agree with our terms and conditions.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={postTweet}>Post</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      {data && (
        <div className="cardContainer">
          {Object.entries(data.text_classify).map(([key, value]) => (
            <motion.div
              // className="container"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <DisplayTextCard key={key} customKey={key} value={value} />
            </motion.div>
          ))}
          {data.img_classify !== "No Image Selected" ? (
            <motion.div
              // className="container"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <DisplayImageCard classify={data.img_classify} />
            </motion.div>
          ) : null}
          {/* <motion.div
            // className="container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <DisplayImageCard classify={data.img_classify} />
          </motion.div> */}
        </div>
      )}
      <ToastContainer theme="light" />
    </div>
  );
};

export default InputPage;
