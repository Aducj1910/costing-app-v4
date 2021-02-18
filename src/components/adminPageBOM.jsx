import React, { Component } from "react";
import NavBar from "./navBar";
import { db, auth } from "../services/firebase";
import { Row, Table, DropdownButton, Dropdown, Button } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiTwotoneDelete, AiFillEdit, AiTwotoneEdit } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";

class AdminPageBOM extends Component {
  state = {
    BOMItemsArray: [],
    customRowAddBool: false,
    titlebgColor: false,
    currentIdEditing: -1,
    limitsArray: [],
    selectedRange: null,
  };

  deleteBOMItem = (itemToDelId) => {
    console.log(itemToDelId);
    db.collection("BOM")
      .doc(itemToDelId)
      .delete()
      .then(
        function () {
          this.handleBOMItemsImport();
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  };

  editBOMItem = (itemToEditId) => {
    if (this.state.currentIdEditing == -1) {
      this.setState({ currentIdEditing: itemToEditId });
    } else if (this.state.currentIdEditing == itemToEditId) {
      let nameToPush = document.getElementById(itemToEditId + "name").value;
      let typeToPush = document.getElementById(itemToEditId + "type").value;
      let unitToPush = document.getElementById(itemToEditId + "unit").value;
      let rateToPush = document.getElementById(itemToEditId + "rate").value;
      db.collection("BOM").doc(itemToEditId).update({
        name: nameToPush,
        type: typeToPush,
        unit: unitToPush,
        rate: rateToPush,
      });
      this.setState({ currentIdEditing: -1 });
    }
  };

  newLimit = () => {
    let inputLimits = document.getElementById("limitInput").value;
    let inputLimitsArr = inputLimits.split("-");
    let limitsObject = { lower: inputLimitsArr[0], upper: inputLimitsArr[1] };
    let limitsArray = this.state.limitsArray;
    limitsArray.push(limitsObject);
    this.setState({ limitsArray });
  };

  editingItemsConfirmed = () => {
    this.state.BOMItemsArray.forEach((element) => {
      let rate = document.getElementById(element.id + "rate").value;
      let objLimits = this.state.limitsArray[this.state.limitsArray.length - 1];
      let rateName = "rate" + objLimits.lower + "-" + objLimits.upper + "_";
      element[rateName] = rate;
      console.log(element);
      db.collection("BOM").doc(element.id).set(element);
    });
  };

  getBOMTableContent = () => {
    //BOM TABLE CONTENT RENDER
    let rateDisplay = null;
    if (this.state.selectedRange !== null) {
      rateDisplay =
        this.state.selectedRange.lower +
        "-" +
        this.state.selectedRange.upper +
        "_";
    } else {
      rateDisplay = "rate";
    }

    return this.state.BOMItemsArray.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>
          <input id={item.id + "name"} type="text" defaultValue={item.name} />
        </td>
        <td>
          <input id={item.id + "type"} type="text" defaultValue={item.type} />
        </td>
        <td>
          <input id={item.id + "unit"} type="text" defaultValue={item.unit} />
        </td>
        <td>
          <input
            id={item.id + "rate"}
            type="text"
            defaultValue={item[rateDisplay]}
          />
        </td>
        <td>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => this.deleteBOMItem(item.id)}
          >
            <AiTwotoneDelete />
          </button>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => this.editBOMItem(item.id)}
          >
            {this.state.currentIdEditing == item.id ? (
              <FcCheckmark />
            ) : (
              <AiTwotoneEdit />
            )}
          </button>
        </td>
      </tr>
    ));
  };

  toggleEditingMode = () => {
    if (this.state.titlebgColor == false) {
      this.setState({ titlebgColor: "green" });
      this.newLimit();
    } else {
      this.setState({ titlebgColor: false });
      this.editingItemsConfirmed();
    }
  };

  componentDidMount = () => {
    this.handleBOMItemsImport();
  };

  handleBOMItemsImport = () => {
    console.log("Called");
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

  pushNewData = () => {
    let addedId = document.getElementById("customRowId").value;
    let addedName = document.getElementById("customRowName").value;
    let addedType = document.getElementById("customRowType").value;
    let addedUnit = document.getElementById("customRowUnit").value;
    let addedRate = document.getElementById("customRowRate").value;

    db.collection("BOM").doc(addedId).set({
      name: addedName,
      type: addedType,
      unit: addedUnit,
      rate: addedRate,
      id: addedId,
    });

    this.handleBOMItemsImport();
    this.deleteCustomRowData();
  };

  deleteCustomRowData = () => {
    document.getElementById("customRowId").value = "";
    document.getElementById("customRowName").value = "";
    document.getElementById("customRowType").value = "";
    document.getElementById("customRowUnit").value = "";
    document.getElementById("customRowRate").value = "";
  };

  addCustomRow = () => {
    //ADDING NEW DATA
    return (
      <tr>
        <td>
          Id: <input id="customRowId" type="text" style={{ width: 50 }} />{" "}
        </td>
        <td>
          Name: <input id="customRowName" />
        </td>
        <td>
          Type: <input id="customRowType" type="text" />
        </td>
        <td>
          Unit: <input id="customRowUnit" type="text" />
        </td>
        <td>
          Rate: <input id="customRowRate" type="text" />
        </td>
        <td>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => this.pushNewData()}
          >
            <FcCheckmark />
          </button>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => this.deleteCustomRowData()}
          >
            <AiTwotoneDelete />
          </button>
        </td>
      </tr>
    );
  };

  // onRangeSelect = (selectedLimitsObj) => {
  //   this.setState({ selectedRange: selectedLimitsObj });
  // };

  render() {
    return (
      <div id="main_table">
        <header>
          <NavBar />
        </header>
        <Row className="m-2">
          <DropdownButton>
            {/* {this.state.limitsArray.map((
              limit //DO THIS NEXT
            ) => (
              <Dropdown.Item onClick={() => this.onRangeSelect(limit)}>
                {limit.lower}-{limit.upper}
              </Dropdown.Item>
            ))} */}
          </DropdownButton>
          <input id="limitInput" className="ml-2" type="text" />
          <Button
            className="ml-2"
            variant="success"
            onClick={() => this.toggleEditingMode()}
          >
            {this.state.titlebgColor == false ? "Edit" : "Confirm"}
          </Button>
        </Row>
        <Table className="mt-2" striped bordered hover>
          <thead>
            <tr style={{ backgroundColor: this.state.titlebgColor }}>
              <th>Id</th>
              <th>Item name</th>
              <th>Item type</th>
              <th>Unit</th>
              <th>Rate (in Rs)</th>
              <th>
                <button
                  style={{ border: "none", background: "none" }}
                  onClick={() => this.setState({ customRowAddBool: true })}
                >
                  <BsPlusCircleFill />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.getBOMTableContent()}
            {this.state.customRowAddBool ? this.addCustomRow() : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AdminPageBOM;
