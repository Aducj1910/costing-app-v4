import React, { Component } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { FaEyeDropper } from "react-icons/fa";
import ComponentDropdown from "./componentDropdown";
import PatternDropdown from "./patternDropdown";
import SilhouettesDropdown from "./silhouettesDropdown";

class ToolBar extends Component {
  state = {};
  render() {
    return (
      <ButtonGroup vertical>
        <Button>
          {" "}
          <FaEyeDropper /> Color
        </Button>
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
