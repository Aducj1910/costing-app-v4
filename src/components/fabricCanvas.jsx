import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { Row } from "react-bootstrap";
import EditingCanvas from "./editingCanvas";
import { Button } from "react-bootstrap";

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

  //Object renditions
  const addComponent = () => {
    comp.src = currentComp;
    comp_ = new fabric.Image(comp, { left: 100, top: 15 }); //left, top are used to indicate the inital render position of the object
    componentsGroup.addWithUpdate(comp_);

    canvas.on("selection:created", function (options) {
      document.getElementById("editButton").disabled = false;
    });

    canvas.on("selection:cleared", function (options) {
      document.getElementById("editButton").disabled = true;
    });

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

  const editingObjectGetter = () => {
    return canvas.getActiveObject();
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

      <Row xs={4} className="justify-content-md-center">
        {" "}
        {/* Have to add this button in this file because of bug in fabric.js */}
        <Button variant="danger" id="editButton" disabled={true}>
          Edit
        </Button>
      </Row>
      <Row>
        <EditingCanvas editFun={editingObjectGetter} />
      </Row>
    </div>
  );
};

export default Fabric_Canvas_My;
