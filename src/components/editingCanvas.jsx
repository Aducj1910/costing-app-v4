import React, { Component, useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Row, Button, Col } from "react-bootstrap";
import {
  ChromePicker,
  HuePicker,
  PhotoshopPicker,
  SliderPicker,
} from "react-color";

const EditingCanvas = (props) => {
  const { editFun, isEditingModeOn, forwardedRef, setEditedObjectSrc } = props;

  const [canvas2, setCanvas] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const initCanvas = () =>
    new fabric.StaticCanvas("canvas2", {
      height: 500,
      width: 700,
      // backgroundColor: "yellow",
    });

  var objectToRender;
  var localSrc;
  var k = 0;
  var selectedColor;
  var bgColor;

  const handleChangeComplete = (color) => {
    selectedColor = color;
    bgColor = color.hex;
    newColor();
  };

  const RenderEditableObject = () => {
    objectToRender = editFun();
    // canvas2.add(objectToRender);
    canvas2.renderAll();
  };

  const getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let red = 255,
      green = 255,
      blue = 255;

    if (selectedColor !== null) {
      red = selectedColor.rgb.r;
      green = selectedColor.rgb.g;
      blue = selectedColor.rgb.b;
    }

    var imgDataInit = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imgd = imgDataInit.data;

    for (var i = 0, n = imgd.length; i < n; i += 4) {
      let r = imgd[i];
      let g = imgd[i + 1];
      let b = imgd[i + 2];

      if (r === 255 && g === 255 && b === 255) {
        imgd[i] = selectedColor.rgb.r;
        imgd[i + 1] = selectedColor.rgb.g;
        imgd[i + 2] = selectedColor.rgb.b;
      }
    }
    ctx.putImageData(imgDataInit, 0, 0);
    return canvas.toDataURL();
  };

  const newColor = () => {
    var originalSource = objectToRender._originalElement.currentSrc;
    var locImg = new Image();
    locImg.src = originalSource;

    localSrc = getBase64Image(locImg);
    locImg.src = localSrc;

    let newImageToRender = new fabric.Image(locImg, {
      top: 20,
      left: 30,
    }); //make sure the position is same later on
    canvas2.add(newImageToRender);
  };

  const exportComponent = () => {
    setEditedObjectSrc(localSrc);
  };

  return (
    <div ref={forwardedRef} style={{ visibility: "hidden" }}>
      <Row xs={4} className="justify-content-md-center">
        {" "}
        {/* Have to add this button in this file because of bug in fabric.js */}
        <Button className="btn-danger" onClick={() => RenderEditableObject()}>
          Edit
        </Button>
        <HuePicker
          color={bgColor}
          onChangeComplete={handleChangeComplete}
          className="ml-3"
        />
      </Row>
      <Row>
        <button onClick={() => newColor()}>Check</button>
        <button onClick={() => exportComponent()}>Export</button>
        <canvas id="canvas2" />
      </Row>
    </div>
  );
};

export default EditingCanvas;
