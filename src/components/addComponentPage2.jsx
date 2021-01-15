import React, { Component, useState } from "react";
import {
  Col,
  Row,
  Table,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import NavBar from "./navBar";
import { FcPlus } from "react-icons/fc";
import AdminGetItemType from "./adminGetItemType";
import { db, auth } from "../services/firebase";

class AddComponentPage extends Component {
  state = {
    itemCount: 0,
    BOMItemsArray: [],
    itemTypeObject: {},
    imgComp: null,
  };

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

  getComponentImage = (event) => {
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

  onUpload = () => {
    let typeObjList = [];
    for (var i = 0; i < this.state.itemCount; i++) {
      let itemName = document.getElementById("name-lbl" + i).innerHTML;
      let itemType = this.state.itemTypeObject[i];
      let itemConsumption = document.getElementById("consumption" + i).value;
      let typeObj = {
        name: itemName,
        type: itemType,
        consumption: itemConsumption,
      };
      typeObjList.push(typeObj);
    }
    db.collection("components").add({
      comp: this.state.imgComp,
      config: typeObjList,
    });
  };

  onNewItemAdd = () => {
    let count = this.state.itemCount + 1;
    this.setState({ itemCount: count });
  };

  RenderItemNameChoice = (index) => {
    let type = this.state.itemTypeObject[index];
    let localRawArray = this.state.BOMItemsArray;
    let nameArray = [];
    localRawArray.forEach((element) => {
      if (element.type === type) {
        nameArray.push(element);
      }
    });

    const itemClicked = (element) => {
      document.getElementById("name-lbl" + index).innerHTML = element.name;
    };

    return (
      <React.Fragment>
        <DropdownButton id={"name" + index} className="ml-2">
          {nameArray.map((element) => (
            <Dropdown.Item
              onClick={() => itemClicked(element)}
              key={element.id}
            >
              {element.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <h6 className="ml-2 mt-2" id={"name-lbl" + index}>
          Check
        </h6>
      </React.Fragment>
    );
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
            />
            {this.RenderItemNameChoice(i)}
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
          <input type="file" onChange={this.getComponentImage} />
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
