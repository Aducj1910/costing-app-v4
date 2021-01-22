import React, { Component } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import ComponentDropdown from "./componentDropdown";
import EyeDropTool from "./eyeDropTool";
import PatternDropdown from "./patternDropdown";
import SilhouettesDropdown from "./silhouettesDropdown";

class ToolBar extends Component {
  state = { editButtonDisplay: "none" };

  render() {
    return (
      <ButtonGroup vertical>
        <EyeDropTool
          onHandleColorChangeComplete={this.props.onHandleColorChangeComplete}
          bgColor={this.props.bgColor}
          onHandleColorUpload={this.props.onHandleColorUpload}
        />
        <ComponentDropdown
          label="Components"
          uploadedComponentFiles={this.props.uploadedComponentFiles}
          importedComponentFiles={this.props.importedComponentFiles}
          drawComponent={this.props.drawComponent}
        ></ComponentDropdown>
        <SilhouettesDropdown
          label="Silhouettes"
          combinedSilhouettesArray={this.props.combinedSilhouettesArray}
          drawSilhouettes={this.props.drawSilhouettes}
        ></SilhouettesDropdown>
        <PatternDropdown
          label="Patterns"
          uploadedPatternFiles={this.props.uploadedPatternFiles}
          drawPattern={this.props.drawPattern}
        />
        {/* <Button variant="danger" style={{ display: "true" }}>
          Edit
        </Button> */}
      </ButtonGroup>
    );
  }
}

export default ToolBar;
