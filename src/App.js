import React, { Component, createRef } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import AddComponentPage from "./components/addComponentPage";
import AdminPageBOM from "./components/adminPageBOM";
import AdminPageCMT from "./components/adminPageCMT";
import MainDesign from "./components/mainDesign";
import { db, auth } from "./services/firebase";
//import component data from firebase db

class App extends Component {
  state = {
    uploadedComponentFiles: [],
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
  }; //importedComponentFiles for firestore database

  // constructor(props) {
  //   super(props);

  //   this.hiddenInputRef = React.createRef(null);
  //   this.setState({ hiddenRef: this.hiddenInputRef });
  // }

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
        // console.log(pvtImpCompArray);
        // console.log(pvtImpCompArray[0].config[0].name);
        this.setState({
          importedComponentFiles: pvtImpCompArray,
        });
      })
      .catch((error) => console.log(error));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyFunction, false);
    document.removeEventListener("click", this.mouseFunction, false);
  }

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

  drawComponent = (componentComp, componentName) => {
    this.setState({
      currentComp: componentComp,
      componentRenderSwitch: true,
      silhouetteRenderSwitch: false,
      patternRenderSwitch: false,
    });
  };

  drawSilhouettes = (silht) => {
    this.setState({
      currentSilhouette: silht,
      silhouetteRenderSwitch: true,
      componentRenderSwitch: false,
      patternRenderSwitch: false,
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
            uploadedSilhouetteFiles={this.state.uploadedSilhouetteFiles}
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
        <Route path="/add-component">
          <AddComponentPage />
        </Route>
      </div>
    );
  }
}

export default App;
