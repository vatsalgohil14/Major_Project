import React from "react";
import RingLoader from "react-spinners/RingLoader";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="page">
      <div className="loader">
        <RingLoader
          color={"#ffffff"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      <p className="text">Please wait while your data is being processed....</p>
    </div>
  );
};

export default Loader;
