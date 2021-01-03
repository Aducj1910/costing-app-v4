import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { Row } from "react-bootstrap";
import EditingCanvas from "./editingCanvas";

const Fabric_Canvas_My = (props) => {
  const {
    currentComp,
    currentSilhouette,
    silhouetteRenderSwitch,
    componentRenderSwitch,
    patternRenderSwitch,
    colorRenderSwitch,
    currentPatternComp,
    deleteActiveObject,
    bgColor,
  } = props;

  const [canvas, setCanvas] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 500,
      width: 700,
    });

  let comp = new Image();
  var comp_ = new fabric.Image(comp);

  let patternImg = new Image();
  var patternImg_ = new fabric.Image(patternImg);

  let main = new Image();
  let mask = new Image();
  var main_ = new fabric.Image(main);
  var mask_ = new fabric.Image(mask);

  var componentsGroup = new fabric.Group();
  var silhouettesGroup = new fabric.Group();
  var patternsGroup = new fabric.Group();

  const addComponent = () => {
    comp.src = currentComp;
    comp_ = new fabric.Image(comp);
    componentsGroup.addWithUpdate(comp_);

    canvas.add(comp_);
  };

  const addSilhouette = () => {
    main.src = currentSilhouette[0].comp;
    mask.src = currentSilhouette[1].comp;

    main_ = new fabric.Image(main, { selectable: false });
    mask_ = new fabric.Image(mask, { selectable: false });

    canvas.add(main_);
    canvas.add(mask_);
    canvas.renderAll();
  };

  const addPattern = () => {
    patternImg.src = currentPatternComp;
    patternImg_ = new fabric.Image(patternImg);

    canvas.setBackgroundImage(patternImg_);
  };

  const removeObject = () => {
    canvas.remove(canvas.getActiveObject());
  };

  const addColor = () => {
    var colorImg = new fabric.Rect({
      width: 700,
      height: 500,
      fill: bgColor,
    });

    colorImg.cloneAsImage(
      (function () {
        return function (clone) {
          canvas.setBackgroundImage(clone);
        };
      })()
    );
  };

  if (silhouetteRenderSwitch) {
    addSilhouette();
  }

  if (componentRenderSwitch) {
    addComponent();
  }

  if (patternRenderSwitch) {
    addPattern();
  }

  if (colorRenderSwitch) {
    addColor();
    //create pattern image of that type
  }

  if (deleteActiveObject && canvas.getActiveObject() != null) {
    removeObject();
  }

  return (
    <div>
      <Row>
        <canvas id="canvas" />
      </Row>
      <Row>
        <EditingCanvas />
      </Row>
    </div>
  );
};

export default Fabric_Canvas_My;
