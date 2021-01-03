import React, { Component, createRef } from "react";
import { Route, Switch } from "react-router-dom";
import MainDesign from "./components/mainDesign";
import { db, auth } from "./services/firebase";

class App extends Component {
  state = {
    uploadedComponentFiles: [],
    uploadedPatternFiles: [],
    uploadedSilhouetteMainFiles: null, //only locally used
    uploadedSilhouetteMaskFiles: null, //only locally used
    combinedSilhouettesArray: [],
    currentPatternComp: null,
    patternRenderSwitch: false,
    componentRenderSwitch: false,
    silhouetteRenderSwitch: false,
    colorRenderSwitch: false,
    deleteActiveObject: false,
    editingModeOn: false,
    currentComp: null,
    currentSilhouette: null,
    bgColor: "#ffffff",
    buttonProcessing: [0, "outline-warning", "Process"],
  }; //importedComponentFiles for firestore database

  // constructor(props) {
  //   super(props);

  //   this.hiddenInputRef = React.createRef(null);
  //   this.setState({ hiddenRef: this.hiddenInputRef });
  // }

  componentDidMount() {
    document.addEventListener("keydown", this.keyFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyFunction, false);
  }

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
      colorRenderSwitch: false,
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

  drawComponent = (componentComp) => {
    this.setState({
      currentComp: componentComp,
      componentRenderSwitch: true,
      silhouetteRenderSwitch: false,
      patternRenderSwitch: false,
      colorRenderSwitch: false,
    });
  };

  drawSilhouettes = (silht) => {
    this.setState({
      currentSilhouette: silht,
      silhouetteRenderSwitch: true,
      componentRenderSwitch: false,
      patternRenderSwitch: false,
      colorRenderSwitch: false,
    });
  };

  drawPattern = (patternComp) => {
    this.setState({
      currentPatternComp: patternComp,
      patternRenderSwitch: true,
      silhouetteRenderSwitch: false,
      componentRenderSwitch: false,
      colorRenderSwitch: false,
    });
  };

  drawColor = () => {
    this.setState({
      colorRenderSwitch: true,
      silhouetteRenderSwitch: false,
      componentRenderSwitch: false,
      patternRenderSwitch: false,
    });
  };

  handleUploadedSilhouetteMainFiles = (event) => {
    this.setState({ uploadedSilhouetteMainFiles: event.target.files[0] });
  };

  handleUploadedSilhouetteMaskFiles = (event) => {
    this.setState({ uploadedSilhouetteMaskFiles: event.target.files[0] });
  };

  handleColorChangeComplete = (color) => {
    this.setState({ bgColor: color.hex, colorRenderSwitch: true });
  };

  handleSilhouettesCombine = () => {
    if (this.state.buttonProcessing[0] == 0) {
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
    } else if (this.state.buttonProcessing[0] == 1) {
      let newLocalArrayofSilhouettes = [
        this.state.uploadedSilhouetteMainFiles,
        this.state.uploadedSilhouetteMaskFiles,
      ];
      let arr = this.state.combinedSilhouettesArray;
      arr.push(newLocalArrayofSilhouettes);
      this.setState({
        combinedSilhouettesArray: arr,
        buttonProcessing: [-1, "outline-success", "Done"],
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
        <Switch>
          <Route path="/" exact>
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
              colorRenderSwitch={this.state.colorRenderSwitch}
              deleteActiveObject={this.state.deleteActiveObject}
              editingModeOn={this.state.editingModeOn}
              bgColor={this.state.bgColor}
              onHandleColorChangeComplete={this.handleColorChangeComplete}
            ></MainDesign>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
