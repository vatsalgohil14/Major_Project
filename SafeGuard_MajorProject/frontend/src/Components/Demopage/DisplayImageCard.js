import React from "react";
import safe from "../../Assets/Icons/safe.png";
import unsafe from "../../Assets/Icons/unsafe.png";
import no_img from "../../Assets/Icons/no-img.png";
import "./DisplayCard.css";

const DisplayImageCard = ({ classify }) => {
  let flag = classify === "No Image Selected" ? true : false;
  let imgClass =
    classify === "porn" || classify === "sexy" || classify === "hentai"
      ? true
      : false;

  return (
    <div className="bigbox">
      <div className="box">
        {
          // flag ? (
          //   <div className="classify-1">
          //     <img src={no_img} alt="img" />
          //     <span className="value"> {classify}</span>
          //   </div>
          // ) :
          imgClass ? (
            <div className="classify-1">
              <img src={unsafe} alt="img" />
              <span className="key-1"> Image Identified as: </span>
              <span className="value"> {classify}</span>
            </div>
          ) : (
            <div className="classify-1">
              <img src={safe} alt="img" />
              <span className="key-1"> Image Identified as: </span>
              <span className="value"> {classify}</span>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default DisplayImageCard;
