import React, { Component } from "react";
import { Row, Button } from "react-bootstrap";
import NavBar from "./navBar";
import Popup from "reactjs-popup";
import tick from "../gifs/tick.gif";
import { db } from "../services/firebase";

class AddSilhouette extends Component {
  state = { toRenderTick: false };

  getTickRender = () => {
    if (this.state.toRenderTick) {
      return <img src={tick} width={40} height={40} />;
    } else {
      return null;
    }
  };

  onUpload = () => {
    let silhouetteCompsArray = [
      this.props.latestSilhouettes[0].comp,
      this.props.latestSilhouettes[1].comp,
    ];
    let id = document.getElementById("compId").value;
    db.collection("silhouettes")
      .doc(id)
      .set({
        id: id,
        name: document.getElementById("compName").value,
        comp: silhouetteCompsArray,
      });
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Row className="m-2">
          <Popup
            trigger={<button className="button"> Silhouette Import </button>}
            modal
          >
            <Row>
              <input
                type="file"
                onChange={this.props.onHandleUploadedSilhouetteMainFiles}
              ></input>
              <Button bsPrefix="super-btn" variant="primary">
                Upload Silhouette Main
              </Button>
            </Row>
            <Row className="mt-3">
              <input
                type="file"
                onChange={this.props.onHandleUploadedSilhouetteMaskFiles}
              ></input>
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
          <input
            className="ml-2 mr-2"
            type="text"
            placeholder="ID"
            id="compId"
            style={{ width: 40 }}
          />
          <input type="text" placeholder="Enter name..." id="compName" />
        </Row>
        <Button
          className="ml-2"
          variant="success"
          onClick={() => this.onUpload()}
        >
          Upload
        </Button>
        {this.getTickRender()}
      </div>
    );
  }
}

export default AddSilhouette;
