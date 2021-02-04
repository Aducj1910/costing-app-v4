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
import { AiTwotoneDelete } from "react-icons/ai";
import { db, auth } from "../services/firebase";
import tick from "../gifs/tick.gif";

class AddComponentPage extends Component {
  state = {
    itemCount: 0,
    itemCountArray: [],
    BOMItemsArray: [],
    itemTypeObject: {},
    imgComp: null,
    componentId: null,
    toRenderTick: false,
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
    let itemCountArray = this.state.itemCountArray;
    let typeObjList = [];

    itemCountArray.forEach((element) => {
      console.log(element);
      let itemName = document.getElementById("name-lbl" + element).innerHTML;
      let itemType = this.state.itemTypeObject[element];
      let itemConsumption = document.getElementById("consumption" + element)
        .value;
      let typeObj = {
        name: itemName,
        type: itemType,
        consumption: itemConsumption,
      };
      typeObjList.push(typeObj);
    });

    db.collection("components")
      .doc(this.state.componentId)
      .set({
        name: document.getElementById("compName").value,
        comp: this.state.imgComp,
        config: typeObjList,
      });

    this.setState({ toRenderTick: true });
    setTimeout(
      function () {
        this.setState({ toRenderTick: false });
      }.bind(this),
      3000
    );
  };

  onNewItemAdd = () => {
    let itemCount = this.state.itemCount + 1;
    let itemCountArray = this.state.itemCountArray;
    itemCountArray.push(itemCount - 1);
    this.setState({ itemCount, itemCountArray });
  };

  deleteItem = (index) => {
    let rowToDelete = document.getElementById("tr" + index);
    let itemCountArray = this.state.itemCountArray;
    var i = itemCountArray.indexOf(index);
    if (index !== -1) {
      itemCountArray.splice(i, 1);
    }
    rowToDelete.remove();
    this.setState({ itemCountArray });
    console.log(itemCountArray);
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
          ---
        </h6>
      </React.Fragment>
    );
  };

  getId = (event) => {
    this.setState({ componentId: event.target.value });
  };

  renderNewItemInput = () => {
    return [...Array(this.state.itemCount)].map((e, i) => (
      <tr id={"tr" + i} key={i}>
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
        <td>
          <button
            style={{ background: "none", border: "none" }}
            id={"delete" + i}
            onClick={() => this.deleteItem(i)}
          >
            <AiTwotoneDelete />
          </button>
        </td>
      </tr>
    ));
  };

  getTickRender = () => {
    if (this.state.toRenderTick) {
      return <img src={tick} width={40} height={40} />;
    } else {
      return null;
    }
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Row className="m-2">
          <input type="file" onChange={this.getComponentImage} />
          <input //ADD FUNCTIONALITY TO THIS FEATURE OF COMPONENT ID LATER ON
            className="mr-2" //IMP
            type="text" //IMP
            placeholder="ID" //IMP
            id="compId" //IMP
            style={{ width: 40 }} //IMP
            onChange={this.getId}
          />
          <input type="text" placeholder="Enter name..." id="compName" />
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
          {this.getTickRender()}
        </Row>
      </div>
    );
  }
}

export default AddComponentPage;
