import React, { Component, useState, useEffect } from "react";
import { fabric } from "fabric";

const EditingCanvas = (props) => {
  const { editFun } = props;

  const [canvas2, setCanvas] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const initCanvas = () =>
    new fabric.Canvas("canvas2", {
      height: 500,
      width: 700,
    });

  const RenderEditableObject = () => {
    var objectToRender = editFun();
    canvas2.add(objectToRender);
  };

  //   const editInCanvas = () => {
  //     focusObject = getCurrentSelectedObject();

  //     if (focusObject !== null) {
  //       canvas2.add(focusObject);
  //     }
  //   };

  //   if (editingModeOn) {
  //     editInCanvas();
  //   }

  return (
    <React.Fragment>
      <canvas id="canvas2" />
      <button onClick={() => RenderEditableObject()}>Check</button>
    </React.Fragment>
  );
};

export default EditingCanvas;
