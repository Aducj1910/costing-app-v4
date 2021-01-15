import React, { Component } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";
import NavBar from "./navBar";
import { FcPlus } from "react-icons/fc";
import AdminGetItemType from "./adminGetItemType";
import { db, auth } from "../services/firebase";

class AddComponentPage extends Component {
  state = { itemCount: 0, BOMItemsArray: [], itemTypeObject: {} };

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

  onItemTypeSelected = (rowId, selectedType) => {
    let itemTypeObject = this.state.itemTypeObject;
    itemTypeObject[rowId] = selectedType;
    this.setState({ itemTypeObject });
  };

  onUpload = () => {
    for (var i = 0; i < this.state.itemCount; i++) {
      let itemName = document.getElementById("type" + i).value;
      let itemType = this.state.itemTypeObject[i];
      let itemConsumption = document.getElementById("consumption" + i).value;
    }
  };

  onNewItemAdd = () => {
    let count = this.state.itemCount + 1;
    this.setState({ itemCount: count });
  };

  renderNewItemInput = () => {
    return [...Array(this.state.itemCount)].map((e, i) => (
      <tr key={i}>
        <td>
          <Row>
            <AdminGetItemType
              rawArray={this.state.BOMItemsArray}
              inRow={i}
              onItemTypeSelected={this.onItemTypeSelected}
            />{" "}
            <input type="text" id={"type" + i} className="ml-2" />
          </Row>
        </td>
        <td>
          <input type="text" id={"consumption" + i} />
        </td>
      </tr>
    ));
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Row className="m-2">
          <input type="file" />
        </Row>
        <Row className="m-2">
          <Table>
            <tr>
              <th>
                Item
                <button
                  onClick={() => this.onNewItemAdd()}
                  style={{ border: "none", background: "none" }}
                >
                  <FcPlus />
                </button>
              </th>
              <th>Consumption</th>
            </tr>
            {this.renderNewItemInput()}
          </Table>
          <Button variant="success" onClick={() => this.onUpload()}>
            Upload
          </Button>
        </Row>
      </div>
    );
  }
}

export default AddComponentPage;
