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
import Popup from "reactjs-popup";

class AddComponentPage extends Component {
  state = {
    componentType: "Component",
    BOMitemCount: 0,
    BOMitemCountArray: [],
    CMTitemCount: 0,
    CMTitemCountArray: [],
    BOMItemsArray: [],
    CMTItemsArray: [],
    itemTypeObject: {},
    CMTTitleObject: {},
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

    db.collection("CMT")
      .get()
      .then((snapshot) => {
        let pvtCMTItemsArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtCMTItemsArray.push(data);
        });
        this.setState({ CMTItemsArray: pvtCMTItemsArray });
      });
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
    let BOMitemCountArray = this.state.BOMitemCountArray;
    let CMTitemCountArray = this.state.CMTitemCountArray;
    let typeObjList = [];
    let CMTtypeObjList = [];

    BOMitemCountArray.forEach((element) => {
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

    CMTitemCountArray.forEach((element) => {
      console.log(element);
      let itemActivity = this.state.CMTTitleObject[element];
      let itemConsumption = document.getElementById("CMT-consumption" + element)
        .value;
      let CMTTypeObj = {
        activity: itemActivity,
        consumption: itemConsumption,
      };
      CMTtypeObjList.push(CMTTypeObj);
    });

    if (this.state.componentType == "Silhouette") {
      let silhouetteCompsArray = [
        this.props.latestSilhouettes[0].comp,
        this.props.latestSilhouettes[1].comp,
      ];

      db.collection("silhouettes")
        .doc(this.state.componentId)
        .set({
          id: document.getElementById("compId").value,
          name: document.getElementById("compName").value,
          comp: silhouetteCompsArray,
          config: typeObjList,
          CMT_config: CMTtypeObjList,
        });
    } else {
      db.collection("components")
        .doc(this.state.componentId)
        .set({
          id: document.getElementById("compId").value,
          name: document.getElementById("compName").value,
          comp: this.state.imgComp,
          config: typeObjList,
          CMT_config: CMTtypeObjList,
        });
    }

    this.setState({ toRenderTick: true });
    setTimeout(
      function () {
        this.setState({ toRenderTick: false });
        window.location.reload();
      }.bind(this),
      3000
    );
  };

  onNewBOMItemAdd = () => {
    let BOMitemCount = this.state.BOMitemCount + 1;
    let BOMitemCountArray = this.state.BOMitemCountArray;
    BOMitemCountArray.push(BOMitemCount - 1);
    this.setState({ BOMitemCount, BOMitemCountArray });
  };

  onNewCMTItemAdd = () => {
    let CMTitemCount = this.state.CMTitemCount + 1;
    let CMTitemCountArray = this.state.CMTitemCountArray;
    CMTitemCountArray.push(CMTitemCount - 1);
    this.setState({ CMTitemCount, CMTitemCountArray });
  };

  deleteItem = (index) => {
    let rowToDelete = document.getElementById("tr" + index);
    let BOMitemCountArray = this.state.BOMitemCountArray;
    var i = BOMitemCountArray.indexOf(index);
    if (index !== -1) {
      BOMitemCountArray.splice(i, 1);
    }
    rowToDelete.remove();
    this.setState({ BOMitemCountArray });
  };

  RenderBOMItemNameChoice = (index) => {
    let type = this.state.itemTypeObject[index];
    let localBOMRawArray = this.state.BOMItemsArray;
    let nameArray = [];
    localBOMRawArray.forEach((element) => {
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

  getCMTTitle = (index, activityName) => {
    let CMTTitleObject = this.state.CMTTitleObject;
    CMTTitleObject[index] = activityName;
    this.setState({ CMTTitleObject });
  };

  deleteCMTItem = (index) => {
    let rowToDelete = document.getElementById("CMTtr" + index);
    let CMTitemCountArray = this.state.CMTitemCountArray;
    var i = CMTitemCountArray.indexOf(index);
    if (index !== -1) {
      CMTitemCountArray.splice(i, 1);
    }
    rowToDelete.remove();
    this.setState({ CMTitemCountArray });
  };

  renderNewCMTItemInput = () => {
    return [...Array(this.state.CMTitemCount)].map((e, i) => (
      <tr id={"CMTtr" + i} key={i}>
        <td>
          <Row>
            <DropdownButton
              title={
                this.state.CMTTitleObject[i]
                  ? this.state.CMTTitleObject[i]
                  : "Select"
              }
            >
              {this.state.CMTItemsArray.map((item) => (
                <Dropdown.Item
                  onClick={() => this.getCMTTitle(i, item.activity)}
                  key={item.id}
                >
                  {item.activity}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Row>
        </td>
        <td>
          <input id={"CMT-consumption" + i} type="text" />
        </td>
        <td>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => this.deleteCMTItem(i)}
          >
            <AiTwotoneDelete />
          </button>
        </td>
      </tr>
    ));
  };

  changeComponentType = () => {
    if (this.state.componentType == "Component") {
      this.setState({ componentType: "Silhouette" });
    } else if (this.state.componentType == "Silhouette") {
      this.setState({ componentType: "Component" });
    }
  };

  renderNewBOMItemInput = () => {
    return [...Array(this.state.BOMitemCount)].map((e, i) => (
      <tr id={"tr" + i} key={i}>
        <td>
          <Row>
            <AdminGetItemType
              rawArray={this.state.BOMItemsArray}
              inRow={i}
              onItemTypeSelected={this.onItemTypeSelected}
            />
            {this.RenderBOMItemNameChoice(i)}
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

  fileUploadRender = () => {
    if (this.state.componentType == "Silhouette") {
      return (
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
      );
    } else {
      return <input type="file" onChange={this.getComponentImage} />;
    }
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
          {this.fileUploadRender()}
          <input
            className="mr-2 ml-2"
            type="text"
            placeholder="ID"
            id="compId"
            style={{ width: 40 }}
            onChange={this.getId}
          />
          <input type="text" placeholder="Enter name..." id="compName" />
          <Button
            className="ml-2"
            variant="warning"
            onClick={() => this.changeComponentType()}
          >
            {this.state.componentType + " (Click to toggle)"}
          </Button>
        </Row>
        <Row className="m-2">
          <Table>
            <tr>
              <th width={600}>
                Item
                <button
                  onClick={() => this.onNewBOMItemAdd()}
                  style={{ border: "none", background: "none" }}
                >
                  <FcPlus />
                </button>
              </th>
              <th>Consumption</th>
            </tr>
            {this.renderNewBOMItemInput()}
          </Table>
        </Row>
        <Row className="m-2">
          <Table>
            <tr>
              <th width={600}>
                Process{" "}
                <button
                  style={{ border: "none", background: "none" }}
                  onClick={() => this.onNewCMTItemAdd()}
                >
                  <FcPlus />
                </button>
              </th>
              <th>Consumption</th>
            </tr>
            {this.renderNewCMTItemInput()}
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
