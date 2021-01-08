import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Popup from "reactjs-popup";
import Fabric_Canvas_My from "./fabricCanvas";
import NavBar from "./navBar";
import ToolBar from "./toolBar";

class MainDesign extends Component {
  state = {};

  render() {
    return (
      <div>
        <header>
          <NavBar></NavBar>
        </header>
        <Container fluid>
          <Row>
            <Col className="m-2" xs={1}>
              <ToolBar
                uploadedComponentFiles={this.props.uploadedComponentFiles}
                uploadedPatternFiles={this.props.uploadedPatternFiles}
                hiddenRef={this.props.hiddenRef}
                drawComponent={this.props.drawComponent}
                combinedSilhouettesArray={this.props.combinedSilhouettesArray}
                drawSilhouettes={this.props.drawSilhouettes}
                drawPattern={this.props.drawPattern}
                onHandleColorChangeComplete={
                  this.props.onHandleColorChangeComplete
                }
                bgColor={this.props.bgColor}
                onHandleColorUpload={this.props.onHandleColorUpload}
              ></ToolBar>
            </Col>
            <Col className="ml-3">
              {/* <Canvas
                currentComp={this.props.currentComp}
                componentRenderSwitch={this.props.componentRenderSwitch}
                currentSilhouette={this.props.currentSilhouette}
                silhouetteRenderSwitch={this.props.silhsouetteRenderSwitch}
              ></Canvas> */}
              <Fabric_Canvas_My
                currentComp={this.props.currentComp}
                componentRenderSwitch={this.props.componentRenderSwitch}
                currentSilhouette={this.props.currentSilhouette}
                silhouetteRenderSwitch={this.props.silhouetteRenderSwitch}
                patternRenderSwitch={this.props.patternRenderSwitch}
                currentPatternComp={this.props.currentPatternComp}
                deleteActiveObject={this.props.deleteActiveObject}
              ></Fabric_Canvas_My>
            </Col>
            <Col ml="2">
              <div>
                <label
                  for="files"
                  class="btn"
                  className="mt-2"
                  style={{ color: "red" }}
                >
                  Upload custom components below
                </label>
                <input
                  type="file"
                  onChange={this.props.onHandleUploadedComponentFiles}
                  multiple="multiple"
                />
              </div>
              <div className="mt-3">
                <Button
                  bsPrefix="super-btn"
                  variant="primary"
                  onClick={this.props.onComponentFilesUploadData}
                >
                  Upload Components
                </Button>
              </div>
              <div className="mt-3">
                <label style={{ color: "red" }}>Upload silhouettes below</label>
              </div>
              <div>
                <Popup
                  trigger={
                    <button className="button"> Silhouette Import </button>
                  }
                  modal
                >
                  <Row>
                    <input
                      type="file"
                      onChange={this.props.onHandleUploadedSilhouetteMainFiles}
                    ></input>{" "}
                    <Button bsPrefix="super-btn" variant="primary">
                      Upload Silhouette Main
                    </Button>
                  </Row>
                  <Row className="mt-3">
                    <input
                      type="file"
                      onChange={this.props.onHandleUploadedSilhouetteMaskFiles}
                    ></input>{" "}
                    <Button bsPrefix="super-btn" variant="primary">
                      Upload Silhouette Mask
                    </Button>
                  </Row>
                  <Row className="justify-content-md-center mt-3">
                    <Button
                      variant={this.props.buttonProcessing[1]}
                      onClick={this.props.onHandleSilhouettesCombine}
                    >
                      {this.props.buttonProcessing[2]}
                    </Button>
                  </Row>
                </Popup>
              </div>
            </Col>
            <Col>
              <div>
                <label
                  for="files"
                  class="btn"
                  className="mt-2"
                  style={{ color: "red" }}
                >
                  Upload custom patterns below
                </label>
                <input
                  type="file"
                  onChange={this.props.onHandleUploadedPatternFiles}
                  multiple="multiple"
                />
              </div>
              <div className="mt-3">
                <Button
                  bsPrefix="super-btn"
                  variant="primary"
                  onClick={this.props.onPatternFilesUploadData}
                >
                  Upload Patterns
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default MainDesign;
