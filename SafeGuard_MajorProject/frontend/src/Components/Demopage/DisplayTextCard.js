import React, { useState, useEffect } from "react";
import checked from "../../Assets/Icons/checked.png";
import unchecked from "../../Assets/Icons/unchecked.png";
import "./DisplayCard.css";

const DisplayTextCard = ({ customKey, value }) => {
  let percent = parseInt(value.replace("%", ""));

  return (
    <div className="bigbox">
      <div className="box-text">
        {percent > 50 ? (
          <img src={unchecked} alt="unchecked-img" />
        ) : (
          <img src={checked} alt="checked-img" />
        )}
        {/* <img src={checked} alt="img" /> */}
        <div className="classify">
          <span className="key"> {customKey} : </span>
          <span className="value"> {value}</span>
        </div>
      </div>
    </div>
  );
};

export default DisplayTextCard;
