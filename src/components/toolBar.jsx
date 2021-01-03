import React, { Component } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import ComponentDropdown from "./componentDropdown";
import EyeDropTool from "./eyeDropTool";
import PatternDropdown from "./patternDropdown";
import SilhouettesDropdown from "./silhouettesDropdown";

class ToolBar extends Component {
  state = {};
  render() {
    return (
      <ButtonGroup vertical>
        <EyeDropTool
          onHandleColorChangeComplete={this.props.onHandleColorChangeComplete}
          bgColor={this.props.bgColor}
        />
        <ComponentDropdown
          label="Components"
          uploadedComponentFiles={this.props.uploadedComponentFiles}
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
      </ButtonGroup>
    );
  }
}

export default ToolBar;
