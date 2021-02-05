import React, { Component } from "react";
import { Row } from "react-bootstrap";
import NavBar from "./navBar";
import { db, auth } from "../services/firebase";
import { Button } from "react-bootstrap";
import tick from "../gifs/tick.gif";

class AddPattern extends Component {
  state = { imgComp: null, toRenderTick: false };

  onUpload = () => {
    let id = document.getElementById("compId").value;
    db.collection("patterns")
      .doc(id)
      .set({
        id: document.getElementById("compId").value,
        name: document.getElementById("compName").value,
        comp: this.state.imgComp,
      });

    this.setState({ toRenderTick: true });
    setTimeout(
      function () {
        this.setState({ toRenderTick: false });
        window.location.reload();
      }.bind(this),
      3000
    );
  };

  getTickRender = () => {
    if (this.state.toRenderTick) {
      return <img src={tick} width={40} height={40} />;
    } else {
      return null;
    }
  };

  handleImage = (event) => {
    let file = event.target.files[0];
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        this.setState({ imgComp: reader.result });
      }.bind(this),
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Row className="m-2">
          <input type="file" onChange={this.handleImage} />
          <input
            className="mr-2"
            type="text"
            placeholder="ID"
            id="compId"
            style={{ width: 40 }}
          />
          <input type="text" placeholder="Enter name..." id="compName" />
        </Row>
        <Row className="m-2">
          <img src={this.state.imgComp} />
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

export default AddPattern;
