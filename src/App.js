import { forEach } from "lodash";
import React, { Component, createRef } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import AddComponentPage from "./components/addComponentPage";
import AddPattern from "./components/addPatternPage";
import AddSilhouette from "./components/addSilhouettePage";
import AdminPageBOM from "./components/adminPageBOM";
import AdminPageCMT from "./components/adminPageCMT";
import MainDesign from "./components/mainDesign";
import { db, auth } from "./services/firebase";

class App extends Component {
  state = {
    uploadedComponentFiles: [],
    componentsDrawn: [],
    silhouettesDrawn: [],
    uploadedPatternFiles: [],
    importedComponentFiles: [],
    uploadedSilhouetteMainFiles: null, //only locally used
    uploadedSilhouetteMaskFiles: null, //only locally used
    combinedSilhouettesArray: [],
    currentPatternComp: "abc",
    patternRenderSwitch: false,
    componentRenderSwitch: false,
    silhouetteRenderSwitch: false,
    deleteActiveObject: false,
    editingModeOn: false,
    currentComp: null,
    currentSilhouette: null,
    bgColor: "#ffffff",
    buttonProcessing: [0, "outline-warning", "Process"],
    compDict: {},
    BOM: [],
    CMT: [],
    propertyBOM: [],
    propertyCMT: [],
    estimatedCost: 0,
    importedPatternFiles: [],
    importedSilhouetteFiles: [],
    latestSilhouettes: [],
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keyFunction, false);
    document.addEventListener("click", this.mouseFunction, false);
    db.collection("components")
      .get()
      .then((snapshot) => {
        let pvtImpCompArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtImpCompArray.push(data);
        });
        this.setState({
          importedComponentFiles: pvtImpCompArray,
        });
      })
      .catch((error) => console.log(error));

    db.collection("CMT")
      .get()
      .then((snapshot) => {
        let pvtpropertyCMTArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtpropertyCMTArray.push(data);
        });
        this.setState({ propertyCMT: pvtpropertyCMTArray });
      })
      .catch((error) => console.log(error));

    db.collection("BOM")
      .get()
      .then((snapshot) => {
        let pvtpropertyBOMArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtpropertyBOMArray.push(data);
        });
        this.setState({ propertyBOM: pvtpropertyBOMArray });
      })
      .catch((error) => console.log(error));

    db.collection("patterns")
      .get()
      .then((snapshot) => {
        let pvtPatternArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtPatternArray.push(data);
        });
        this.setState({ importedPatternFiles: pvtPatternArray });
      });

    db.collection("silhouettes")
      .get()
      .then((snapshot) => {
        let pvtSilhouettesArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtSilhouettesArray.push(data);
        });
        this.setState({ importedSilhouetteFiles: pvtSilhouettesArray });
      });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyFunction, false);
    document.removeEventListener("click", this.mouseFunction, false);
  }

  componentDidUpdate = () => {
    this.calculateCost();
  };

  appendDrawn = (typeSwitch, compName, compId) => {
    if (typeSwitch == "component") {
      let componentsDrawn = this.state.componentsDrawn;
      let componentAlreadyDrawn = false;
      componentsDrawn.forEach((element) => {
        if (element.id == compId) {
          element.count += 1;
          componentAlreadyDrawn = true;
        }
      });
      if (!componentAlreadyDrawn) {
        let newComponent = { id: compId, count: 1 };
        componentsDrawn.push(newComponent);
      }

      this.setState({ componentsDrawn });
    } else if (typeSwitch == "silhouette") {
      console.log("Silhouette"); //DO THIS
    }
  };

  // mouseFunction = (event) => {};

  keyFunction = (event) => {
    if (event.keyCode === 46) {
      this.setState({
        deleteActiveObject: true,
        patternRenderSwitch: false,
        componentRenderSwitch: false,
        silhouetteRenderSwitch: false,
      });
    }
  };

  calculateCost = () => {
    //IN PROGRESS
    //calculates cost to be displayed
    let BOM = this.state.BOM;
    let CMT = this.state.CMT;
    let BOMCost = 0;
    let CMTCost = 0;

    BOM.forEach((element) => {
      BOMCost = BOMCost + element.consumption * element.rate;
    });
    CMT.forEach((element) => {
      CMTCost = CMTCost + element.consumption * element.rate;
    });

    console.log(BOMCost + CMTCost);
  };

  handleUploadedComponentFiles = (event) => {
    this.setState({
      uploadedComponentFiles: [
        ...this.state.uploadedComponentFiles,
        ...event.target.files,
      ],
      patternRenderSwitch: false,
      componentRenderSwitch: false,
      silhouetteRenderSwitch: false,
    });
  };

  handleUploadedPatternFiles = (event) => {
    this.setState({
      uploadedPatternFiles: [
        ...this.state.uploadedPatternFiles,
        ...event.target.files,
      ],
    });
  };

  drawComponent = (
    componentComp,
    componentConfig,
    componentCMTConfig,
    componentNameIdArray
  ) => {
    this.setState({
      currentComp: componentComp,
      componentRenderSwitch: true,
      silhouetteRenderSwitch: false,
      patternRenderSwitch: false,
    });

    let propertyBOM = this.state.propertyBOM;
    let propertyCMT = this.state.propertyCMT;
    //adding to local BOM
    let repeatAddition = false;

    this.state.componentsDrawn.forEach((element) => {
      if (element.id == componentNameIdArray[1]) {
        if (element.count == 1) {
          repeatAddition = true;
          console.log("Repeated");
        }
      }
    });
    this.appendDrawn(
      "component",
      componentNameIdArray[0],
      componentNameIdArray[1]
    );

    if (repeatAddition) {
      componentCMTConfig = [];
      componentConfig = [];
    }

    componentCMTConfig.forEach((element) => {
      let unit = "none";
      let rate = -1;
      let id = -1;

      propertyCMT.forEach((CMTElement) => {
        if (element.activity == CMTElement.activity) {
          unit = CMTElement.unit;
          rate = CMTElement.rate;
          id = CMTElement.id;
        }
      });

      let addNew = true;
      let CMT = this.state.CMT;
      CMT.forEach((CMTElement) => {
        if (element.activity == CMTElement.activity) {
          CMTElement.consumption =
            parseFloat(CMTElement.consumption) +
            parseFloat(element.consumption);
          addNew = false;
        }
      });
      this.setState({ CMT });

      if (addNew) {
        let selectedItemCMT = {
          activity: element.activity,
          id: id,
          unit: unit,
          consumption: parseFloat(element.consumption),
          rate: parseFloat(rate),
        };
        CMT.push(selectedItemCMT);
        this.setState({ CMT });
      }
    });

    componentConfig.forEach((element) => {
      let unit = "none";
      let rate = -1;
      let id = -1;

      propertyBOM.forEach((BOMElement) => {
        if (element.name == BOMElement.name) {
          unit = BOMElement.unit;
          rate = BOMElement.rate;
          id = BOMElement.id;
        }
      });

      let addNew = true;
      let BOM = this.state.BOM;
      BOM.forEach((BOMElement) => {
        if (element.name == BOMElement.name) {
          BOMElement.consumption =
            parseFloat(BOMElement.consumption) +
            parseFloat(element.consumption);
          addNew = false;
        }
      });
      this.setState({ BOM });

      if (addNew) {
        let selectedItemBOM = {
          name: element.name,
          type: element.type,
          id: id,
          unit: unit,
          consumption: parseFloat(element.consumption),
          rate: parseFloat(rate),
        };

        BOM.push(selectedItemBOM);
        this.setState({ BOM });
      }
    });
  };

  drawSilhouettes = (silht, silhtId, silhtName) => {
    this.setState({
      currentSilhouette: silht,
      silhouetteRenderSwitch: true,
      componentRenderSwitch: false,
      patternRenderSwitch: false,
    });

    let propertyBOM = this.state.propertyBOM;
    let propertyCMT = this.state.propertyCMT;
    let repeatAddition = false;

    this.state.silhouettesDrawn.forEach((element) => {
      if (element.id == silhtId) {
        if (element.count == 1) {
          repeatAddition = true;
        }
      }
    });

    // this.appendDrawn("silhouette") DO THIS

    if (repeatAddition) {
      console.log(silht.CMT_config);
      silht.CMT_config = [];
      silht.config = [];
    }

    silht.CMT_config.forEach((element) => {
      let unit = "none";
      let rate = -1;
      let id = -1;

      propertyCMT.forEach((CMTElement) => {
        if (element.activity == CMTElement.activity) {
          unit = CMTElement.unit;
          rate = CMTElement.rate;
          id = CMTElement.id;
        }
      });

      let addNew = true;
      let CMT = this.state.CMT;
      CMT.forEach((CMTElement) => {
        if (element.activity == CMTElement.activity) {
          CMTElement.consumption =
            parseFloat(CMTElement.consumption) +
            parseFloat(element.consumption);
          addNew = false;
        }
      });
      this.setState({ CMT });

      if (addNew) {
        let selectedItemCMT = {
          activity: element.activity,
          id: id,
          unit: unit,
          consumption: parseFloat(element.consumption),
          rate: parseFloat(rate),
        };
        CMT.push(selectedItemCMT);
        this.setState({ CMT });
      }
    });

    silht.config.forEach((element) => {
      let unit = "none";
      let rate = -1;
      let id = -1;

      propertyBOM.forEach((BOMElement) => {
        if (element.name == BOMElement.name) {
          unit = BOMElement.unit;
          rate = BOMElement.rate;
          id = BOMElement.id;
        }
      });

      let addNew = true;
      let BOM = this.state.BOM;
      BOM.forEach((BOMElement) => {
        if (element.name == BOMElement.name) {
          BOMElement.consumption =
            parseFloat(BOMElement.consumption) +
            parseFloat(element.consumption);
          addNew = false;
        }
      });
      this.setState({ BOM });

      if (addNew) {
        let selectedItemBOM = {
          name: element.name,
          type: element.type,
          id: id,
          unit: unit,
          consumption: parseFloat(element.consumption),
          rate: parseFloat(rate),
        };

        BOM.push(selectedItemBOM);
        this.setState({ BOM });
      }
    });
  };

  drawPattern = (patternComp) => {
    this.setState({
      currentPatternComp: patternComp,
      patternRenderSwitch: true,
      silhouetteRenderSwitch: false,
      componentRenderSwitch: false,
    });
  };

  handleUploadedSilhouetteMainFiles = (event) => {
    this.setState({ uploadedSilhouetteMainFiles: event.target.files[0] });
  };

  handleUploadedSilhouetteMaskFiles = (event) => {
    this.setState({ uploadedSilhouetteMaskFiles: event.target.files[0] });
  };

  handleColorUpload = () => {
    var hiddenColorCanvas = document.createElement("canvas");
    hiddenColorCanvas.width = 550;
    hiddenColorCanvas.height = 500;

    var ctx = hiddenColorCanvas.getContext("2d");
    ctx.fillStyle = this.state.bgColor;
    ctx.fillRect(0, 0, 500, 500);

    let colorSrc = hiddenColorCanvas.toDataURL();
    this.drawPattern(colorSrc);
  };

  handleColorChangeComplete = (color) => {
    this.setState({ bgColor: color.hex });
  };

  handleSilhouettesCombine = () => {
    if (this.state.buttonProcessing[0] === 0) {
      let imageFileMain = this.state.uploadedSilhouetteMainFiles;
      var reader = new FileReader();
      reader.readAsDataURL(imageFileMain);
      reader.onloadend = function (e) {
        imageFileMain.comp = e.target.result;
        this.setState({ uploadedSilhouetteMainFiles: imageFileMain });
      }.bind(this);

      let imageFileMask = this.state.uploadedSilhouetteMaskFiles;
      var reader2 = new FileReader();
      reader2.readAsDataURL(imageFileMask);
      reader2.onloadend = function (e) {
        imageFileMask.comp = e.target.result;
        this.setState({ uploadedSilhouetteMaskFiles: imageFileMask });
      }.bind(this);
      this.setState({ buttonProcessing: [1, "outline-success", "Done"] });
    } else if (this.state.buttonProcessing[0] === 1) {
      let newLocalArrayofSilhouettes = [
        this.state.uploadedSilhouetteMainFiles,
        this.state.uploadedSilhouetteMaskFiles,
      ];
      let arr = this.state.combinedSilhouettesArray;
      console.log(newLocalArrayofSilhouettes);
      this.setState({ latestSilhouettes: newLocalArrayofSilhouettes });
      arr.push(newLocalArrayofSilhouettes);
      this.setState({
        combinedSilhouettesArray: arr,
        buttonProcessing: [2, "outline-success", "Done"],
      });
    } else if (this.state.buttonProcessing[0] === 2) {
      this.setState({
        buttonProcessing: [-1, "outline-danger", "You can close now"],
      });
    }
  };

  componentFilesUploadData = () => {
    let localComponentFiles = this.state.uploadedComponentFiles;
    let compArray = Array.from(localComponentFiles);

    compArray.forEach(function (item, index) {
      let imageFile = item;
      var reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = function (e) {
        var myImage = new Image();
        myImage.src = e.target.result;
        item.comp = e.target.result;
        // console.log(e.target.result);
        db.collection("components").add({
          comp: e.target.result,
          cost: 40,
          name: item.name,
        });
      };
    });
  };

  patternFilesUploadData = () => {
    let localPatternFiles = this.state.uploadedPatternFiles;
    let compArray = Array.from(localPatternFiles);

    compArray.forEach(function (item, index) {
      let imageFile = item;
      var reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = function (e) {
        var myImage = new Image();
        myImage.src = e.target.result;
        item.comp = e.target.result;
        // console.log(e.target.result);
        db.collection("patterns").add({
          comp: e.target.result,
          cost: 40,
          name: item.name,
        });
      };
    });
  };

  render() {
    return (
      <div>
        <Route exact path="/">
          <MainDesign
            onHandleUploadedComponentFiles={this.handleUploadedComponentFiles}
            onHandleUploadedPatternFiles={this.handleUploadedPatternFiles}
            onHandleUploadedSilhouetteMainFiles={
              this.handleUploadedSilhouetteMainFiles
            }
            onHandleUploadedSilhouetteMaskFiles={
              this.handleUploadedSilhouetteMaskFiles
            }
            combinedSilhouettesArray={this.state.combinedSilhouettesArray}
            onHandleSilhouettesCombine={this.handleSilhouettesCombine}
            onComponentFilesUploadData={this.componentFilesUploadData}
            onPatternFilesUploadData={this.patternFilesUploadData}
            uploadedComponentFiles={this.state.uploadedComponentFiles}
            uploadedPatternFiles={this.state.uploadedPatternFiles}
            importedComponentFiles={this.state.importedComponentFiles}
            importedPatternFiles={this.state.importedPatternFiles}
            importedSilhouetteFiles={this.state.importedSilhouetteFiles}
            currentComp={this.state.currentComp}
            componentRenderSwitch={this.state.componentRenderSwitch}
            drawComponent={this.drawComponent}
            drawSilhouettes={this.drawSilhouettes}
            drawPattern={this.drawPattern}
            buttonProcessing={this.state.buttonProcessing}
            silhouetteRenderSwitch={this.state.silhouetteRenderSwitch}
            currentSilhouette={this.state.currentSilhouette}
            currentPatternComp={this.state.currentPatternComp}
            patternRenderSwitch={this.state.patternRenderSwitch}
            deleteActiveObject={this.state.deleteActiveObject}
            editingModeOn={this.state.editingModeOn}
            bgColor={this.state.bgColor}
            onHandleColorChangeComplete={this.handleColorChangeComplete}
            onHandleColorUpload={this.handleColorUpload}
            compDict={this.state.compDict}
          ></MainDesign>
        </Route>
        <Route path="/admin-bom">
          <AdminPageBOM />
        </Route>
        <Route path="/admin-cmt">
          <AdminPageCMT />
        </Route>
        <Route path="/component">
          <AddComponentPage
            onHandleUploadedSilhouetteMainFiles={
              this.handleUploadedSilhouetteMainFiles
            }
            onHandleUploadedSilhouetteMaskFiles={
              this.handleUploadedSilhouetteMaskFiles
            }
            onHandleSilhouettesCombine={this.handleSilhouettesCombine}
            buttonProcessing={this.state.buttonProcessing}
            latestSilhouettes={this.state.latestSilhouettes}
          />
        </Route>
        <Route path="/pattern">
          <AddPattern />
        </Route>
        {/* <Route path="/silhouette">
          <AddSilhouette />
        </Route> */}
      </div>
    );
  }
}

export default App;
