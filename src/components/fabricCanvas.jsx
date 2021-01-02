import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

const Fabric_Canvas_My = (props) => {
  const {
    currentComp,
    currentSilhouette,
    silhouetteRenderSwitch,
    componentRenderSwitch,
    patternRenderSwitch,
    currentPatternComp,
    deleteActiveObject,
  } = props;

  const [canvas, setCanvas] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 500,
      width: 700,
      preserveObjectStacking: true,
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

  if (silhouetteRenderSwitch) {
    addSilhouette();
  }

  if (componentRenderSwitch) {
    addComponent();
  }

  if (patternRenderSwitch) {
    addPattern();
  }

  if (deleteActiveObject) {
    removeObject();
  }

  return (
    <div>
      <canvas id="canvas" />
    </div>
  );
};

export default Fabric_Canvas_My;
