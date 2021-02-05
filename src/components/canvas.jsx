import React, { Component, useEffect, useRef } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const {
    currentComp,
    componentRenderSwitch,
    currentSilhouette,
    silhouetteRenderSwitch,
  } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.heights);

    let silMain = new Image();
    let silMask = new Image();

    if (silhouetteRenderSwitch) {
      silMain.src = currentSilhouette.comp[0];
      silMask.src = currentSilhouette.comp[1];
    }

    if (componentRenderSwitch) {
      let newComponent = new Image();
      newComponent.src = currentComp;

      ctx.drawImage(newComponent, 0, 0);
      ctx.drawImage(silMask, 0, 0);
      ctx.drawImage(silMain, 0, 0);
    }

    // ctx.fillRect(0, 0, canvas.width, canvas.height); //Remove in final build or during texting. Only here to map out the canvas
  });

  return <canvas width={700} height={500} ref={canvasRef}></canvas>;
};

export default Canvas;
