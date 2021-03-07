import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Popup from "reactjs-popup";
import Fabric_Canvas_My from "./fabricCanvas";
import NavBar from "./navBar";
import ToolBar from "./toolBar";
import { withRouter } from "react-router-dom";
import CountUp from "react-countup";
import { Helmet } from "react-helmet"; //for page title
import ReactToExcel from "react-html-table-to-excel";
import { BiSave } from "react-icons/bi";

class MainDesign extends Component {
  state = { display: "yes", uniqueId: Math.random().toString(36).substring(7) };

  combineExportButtons = () => {
    document.getElementById("r2xl").click();
    this.props.exportCanvas(this.state.uniqueId);
  };

  render() {
    return (
      <div style={{ display: this.state.display }}>
        <Helmet>
          <title>Design</title>
        </Helmet>
        <header>
          <NavBar onCanvasScreen={true}></NavBar>
        </header>
        <Container fluid>
          <Row>
            <Col className="m-2" xs={2}>
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
            <Col>
              {/* <Canvas
                currentComp={this.props.currentComp}
                componentRenderSwitch={this.props.componentRenderSwitch}
                currentSilhouette={this.props.currentSilhouette}
                silhouetteRenderSwitch={this.props.silhsouetteRenderSwitch}
              ></Canvas> */}
              <Fabric_Canvas_My
                currentComp={this.props.currentComp}
                exportName={this.props.exportName}
                componentRenderSwitch={this.props.componentRenderSwitch}
                currentSilhouette={this.props.currentSilhouette}
                silhouetteRenderSwitch={this.props.silhouetteRenderSwitch}
                patternRenderSwitch={this.props.patternRenderSwitch}
                currentPatternComp={this.props.currentPatternComp}
                deleteActiveObject={this.props.deleteActiveObject}
                compDict={this.props.compDict}
                subtractFromCost={this.props.subtractFromCost}
                currentCompId={this.props.currentCompId}
                changeDataExportSwitch={this.props.changeDataExportSwitch}
                dataExportSwitch={this.props.dataExportSwitch}
              />
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
                      start={this.props.prevCost}
                      end={this.props.estimatedCost}
                      duration={0.8}
                    />
                  </h3>
                </Row>
                <Row className="mt-2">
                  <Button onClick={() => this.combineExportButtons()}>
                    <BiSave size={40} /> <b>{"Save & Export"}</b>
                  </Button>
                  <div style={{ display: "none" }}>
                    <ReactToExcel
                      id="r2xl"
                      className="btn-primary"
                      filename={this.state.uniqueId}
                      table="BOMTable"
                      sheet="BOM"
                      buttonText="Export"
                    />
                  </div>
                </Row>
              </div>
              <div style={{ display: "none" }}>
                <table id="BOMTable">
                  <thead>
                    <tr>
                      <th>Item name</th>
                      <th>Item type</th>
                      <th>Consumption</th>
                      <th>Rate</th>
                      <th>Est. Cost</th>
                    </tr>
                    <tbody>
                      {this.props.BOM.map((item) => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td>{item.consumption}</td>
                          <td>{item.rate}</td>
                          <td>{item.consumption * item.rate}</td>
                        </tr>
                      ))}
                      {this.props.CMT.map((item) => (
                        <tr key={item.name}>
                          <td>{item.activity}</td>
                          <td>CMT</td>
                          <td>{item.consumption}</td>
                          <td>{item.rate}</td>
                          <td>{item.consumption * item.rate}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <p></p>
                        </td>
                        <td>
                          <p></p>
                        </td>
                        <td>
                          <p></p>
                        </td>
                        <td>
                          <p></p>
                        </td>
                        <td>{this.props.estimatedCost}</td>
                      </tr>
                    </tbody>
                  </thead>
                </table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(MainDesign);
