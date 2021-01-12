import React, { Component } from "react";
import { Col, DropdownButton, Row, Table } from "react-bootstrap";
import NavBar from "./navBar";
import { db, auth } from "../services/firebase";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { forEach, isNumber } from "lodash";
import { isNumeric } from "jquery";
import { MdCheckCircle } from "react-icons/md";

// TODO: Change the "Fabric: " heading to "Items: ", add a dropdown in order to select the type of
// thing you are chosing (Eg. button, fabric, etc.).
// Then render the dropdown for the name of the item filtered by type.
// Change get & setFabriCount functions.
// Remove instances of variables/labels/functions/etc. using "fabric" in their name and replace with item.

class AddComponentPage extends Component {
  state = { selectedFabric: "None", BOMItemsArray: [], fabricCount: 0 };

  componentDidMount = () => {
    db.collection("BOM")
      .get()
      .then((snapshot) => {
        let pvtBOMItemsArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtBOMItemsArray.push(data);
        });
        this.setState({
          BOMItemsArray: pvtBOMItemsArray,
        });
      })
      .catch((error) => console.log(error));
  };

  createCanvas = () => {
    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;

    var ctx = canvas.getContext("2d");
  };

  setFabricCount = () => {
    let localNum = document.getElementById("inputFabricCount").value;
    if (isNumeric(localNum)) {
      let num = parseInt(localNum);
      num = Math.round(num);
      this.setState({ fabricCount: num });
    }
  };

  getFabricDropdown = () => {
    let pvtFabricDropdownArray = [];
    this.state.BOMItemsArray.forEach((element) => {
      if (element.type === "Fabric") {
        pvtFabricDropdownArray.push({ name: element.name, id: element.id });
      }
    });
    return [...Array(this.state.fabricCount)].map((e, i) => (
      <Row className="m-2">
        <Row>
          <DropdownButton title="Choose Fabric">
            {pvtFabricDropdownArray.map((item) => (
              <DropdownItem key={item.id}>{item.name}</DropdownItem>
            ))}
          </DropdownButton>
          <label className="ml-2">{this.state.selectedFabric}</label>
          <label className="ml-5">
            <b> Consumption: </b>
          </label>
          <input className="ml-1" type="text" />
        </Row>
      </Row>
    ));
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Col>
          <Row>
            <input type="file" className="m-2" />
          </Row>
          <Row>
            <Table>
              <tr>
                <th>
                  Fabric:{" "}
                  <input
                    type="text"
                    style={{ width: 40 }}
                    id="inputFabricCount"
                  />
                  <button
                    style={{ border: "none", background: "none" }}
                    className="ml-2"
                    onClick={() => this.setFabricCount()}
                  >
                    <MdCheckCircle />
                  </button>
                </th>
                <th>
                  CMT Activity: <input type="text" style={{ width: 40 }} />{" "}
                  <button
                    style={{ border: "none", background: "none" }}
                    className="ml-2"
                    onClick={() => this.setFabricCount()}
                  >
                    <MdCheckCircle />
                  </button>
                </th>
              </tr>
              <tr>
                <td>{this.getFabricDropdown()}</td>
              </tr>
            </Table>
          </Row>
        </Col>
      </div>
    );
  }
}

export default AddComponentPage;
