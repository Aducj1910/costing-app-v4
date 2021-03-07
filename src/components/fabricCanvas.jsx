import React, { useState, useEffect, useRef } from "react";
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
    currentPatternComp,
    deleteActiveObject,
    compDict,
    exportName,
    bgColor,
    currentCompId,
    subtractFromCost,
    dataExportSwitch,
    changeDataExportSwitch,
  } = props;

  var editButtonRef = useRef(null);

  const [canvas, setCanvas] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 500,
      width: 600,
      // backgroundColor: "red",
    });

  let comp = new Image();
  var comp_ = new fabric.Image(comp);

  // let patternImg = new Image();
  // var patternImg_ = new fabric.Image(patternImg);

  let main = new Image();
  let mask = new Image();
  var main_ = new fabric.Image(main);
  var mask_ = new fabric.Image(mask);

  var componentsGroup = new fabric.Group();
  var silhouettesGroup = new fabric.Group();
  var patternsGroup = new fabric.Group();

  var localEditComp;

  //Object renditions
  const addComponent = () => {
    comp.src = currentComp;
    comp_ = new fabric.Image(comp); //left, top are used to indicate the inital render position of the object
    comp_.compId = currentCompId;
    componentsGroup.addWithUpdate(comp_);

    canvas.on("selection:created", function (options) {
      // editButtonRef.current.disabled = false;
      editButtonRef.current.style.visibility = "visible";
    });

    canvas.on("selection:cleared", function (options) {
      // editButtonRef.current.variant = true;
      editButtonRef.current.style.visibility = "hidden";
    });

    canvas.add(comp_);
  };

  const getEditedObjectSrc = (objSrc, ID) => {
    addEditedObject(objSrc, ID);
  };

  //removes selected object and adds the edited object in its place
  const addEditedObject = (localSrc, ID) => {
    //getting position of the original object

    let editedCompImage = new Image();
    editedCompImage.src = localSrc;
    let editedObjectToRender = new fabric.Image(editedCompImage, {
      top: localEditComp.top + localEditComp.height / 2,
      left: localEditComp.left + localEditComp.width / 2,
    });
    editedObjectToRender.compId = ID;
    canvas.remove(localEditComp);
    canvas.add(editedObjectToRender);
  };

  const addSilhouette = () => {
    main.src = currentSilhouette.comp[0];
    mask.src = currentSilhouette.comp[1];

    main_ = new fabric.Image(main, { selectable: false });
    mask_ = new fabric.Image(mask, { selectable: false });

    canvas.add(main_);
    canvas.add(mask_);
    canvas.renderAll();
  };

  const addPattern = () => {
    var patternImg = new Image();
    patternImg.src = currentPatternComp;
    let patternImg_ = new fabric.Image(patternImg);

    canvas.setBackgroundImage(patternImg_);
  };

  const removeObject = () => {
    subtractFromCost(canvas.getActiveObject().compId);
    canvas.remove(canvas.getActiveObject());
  };

  const editingObjectGetter = () => {
    localEditComp = canvas.getActiveObject();
    return canvas.getActiveObject();
  };

  const exportToPNG = () => {
    // let garment = canvas
    //   .toDataURL("garment/png", 1.0)
    //   .replace("garment/png", "garment/octet-stream");
    // var link = document.createElement("a");
    // link.download = exportName + ".png";
    // link.href = garment;
    // link.click();

    changeDataExportSwitch();
  };

  const getBase64Image = (img) => {
    var expCanvas = document.createElement("canvas");
    expCanvas.width = img.width;
    expCanvas.height = img.height;

    var ctx = expCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var imgDataInit = ctx.getImageData(0, 0, expCanvas.width, expCanvas.height);
    let imgd = imgDataInit.data;
    console.log(imgd);
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

  if (dataExportSwitch) {
    exportToPNG();
  }

  // if (colorRenderSwitch) {
  //   addColor();
  // }

  if (deleteActiveObject && canvas.getActiveObject() != null) {
    removeObject();
  }

  return (
    <div>
      <Row>
        <canvas id="canvas" />
      </Row>
      <Row>
        <EditingCanvas
          editFun={editingObjectGetter}
          forwardedRef={editButtonRef}
          setEditedObjectSrc={getEditedObjectSrc}
          compDict={compDict}
        />
      </Row>
    </div>
  );
};

export default Fabric_Canvas_My;
