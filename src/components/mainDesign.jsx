import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Popup from "reactjs-popup";
import Fabric_Canvas_My from "./fabricCanvas";
import NavBar from "./navBar";
import ToolBar from "./toolBar";
import { withRouter } from "react-router-dom";
import CountUp from "react-countup";

class MainDesign extends Component {
  state = { display: "yes" };

  render() {
    // console.log(this.props.location.pathname);
    // if (this.props.location.pathname === "/" && this.state.display !== "yes") {
    //   this.setState({ display: "yes" });
    // } else if (
    //   this.props.location.pathname === "/add-component" &&
    //   this.state.display !== "none"
    // ) {
    //   this.setState({ display: "none" });
    // }
    return (
      <div style={{ display: this.state.display }}>
        <header>
          <NavBar onCanvasScreen={true}></NavBar>
        </header>
        <Container fluid>
          <Row>
            <Col className="m-2" xs={1}>
              <ToolBar
                uploadedComponentFiles={this.props.uploadedComponentFiles}
                uploadedPatternFiles={this.props.uploadedPatternFiles}
                importedComponentFiles={this.props.importedComponentFiles}
                importedPatternFiles={this.props.importedPatternFiles}
                importedSilhouetteFiles={this.props.importedSilhouetteFiles}
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
                compDict={this.props.compDict}
              ></Fabric_Canvas_My>
            </Col>
            <Col ml="2">
              <div>
                <Row>
                  <h3 className="mt-4">Cost estimate:</h3>
                </Row>
                <Row>
                  <h3>
                    <CountUp
                      prefix={"₹"}
                      start={50}
                      end={10000}
                      duration={0.8}
                    />
                  </h3>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(MainDesign);
