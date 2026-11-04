import React from "react";

 const DefaultButton = (props) => {
  return (
    <button
      className={props.className }
      onClick={() => {
        props.handleClick();
      }}
    >
      
      {props.text}
    </button>
  );
};

export default DefaultButton;
