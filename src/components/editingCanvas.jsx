import React, { Component, useState, useEffect } from "react";
import { fabric } from "fabric";

const EditingCanvas = () => {
  const [canvas2, setCanvas] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  //   const testFunction = () => {
  //     var rect = new fabric.Rect({ width: 200, height: 150, fill: "yellow" });
  //     canvas2.add(rect);
  //   };

  const initCanvas = () =>
    new fabric.Canvas("canvas2", {
      height: 500,
      width: 700,
    });

  //   const editInCanvas = () => {
  //     focusObject = getCurrentSelectedObject();

  //     if (focusObject !== null) {
  //       canvas2.add(focusObject);
  //     }
  //   };

  //   if (editingModeOn) {
  //     editInCanvas();
  //   }

  return <canvas id="canvas2" />;
};

export default EditingCanvas;
