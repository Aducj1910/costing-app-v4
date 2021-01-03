import { ButtonGroup, Button, Overlay } from "react-bootstrap";
import React, { Component, useState, useRef } from "react";
import { FaEyeDropper } from "react-icons/fa";
import { ChromePicker } from "react-color";

const EyeDropTool = (props) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const { onHandleColorChangeComplete, bgColor } = props;

  return (
    <>
      <Button variant="primary" ref={target} onClick={() => setShow(!show)}>
        <FaEyeDropper /> Color
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              backgroundColor: "alpha",
              padding: "2px 10px",
              color: "white",
              borderRadius: 3,
              ...props.style,
            }}
          >
            <ChromePicker
              color={bgColor}
              onChangeComplete={onHandleColorChangeComplete}
            />
          </div>
        )}
      </Overlay>
    </>
  );
};

export default EyeDropTool;
