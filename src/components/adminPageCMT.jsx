import React, { Component } from "react";
import NavBar from "./navBar";
import { db, auth } from "../services/firebase";
import { Table } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";

class AdminPageCMT extends Component {
  state = {
    CMTItemsArray: [],
    customRowAddBool: false,
    currentIdEditing: -1,
  };

  deleteCMTItem = (itemToDelId) => {
    console.log(itemToDelId);
    db.collection("CMT")
      .doc(itemToDelId)
      .delete()
      .then(
        function () {
          this.handleCMTItemsImport();
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  };

  editCMTItem = (itemToEditId) => {
    console.log(itemToEditId);
    if (this.state.currentIdEditing == -1) {
      this.setState({ currentIdEditing: itemToEditId });
    } else if (this.state.currentIdEditing == itemToEditId) {
      let activityToPush = document.getElementById(itemToEditId + "activity")
        .value;
      let unitToPush = document.getElementById(itemToEditId + "unit").value;
      let rateToPush = document.getElementById(itemToEditId + "rate").value;
      db.collection("CMT").doc(itemToEditId).update({
        activity: activityToPush,
        unit: unitToPush,
        rate: rateToPush,
      });
      this.setState({ currentIdEditing: -1 });
    }
  };

  getCMTTableContent = () => {
    //CMT TABLE CONTENT RENDER
    return this.state.CMTItemsArray.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>
          <input
            id={item.id + "activity"}
            type="text"
            defaultValue={item.activity}
          />
        </td>
        <td>
          <input id={item.id + "unit"} type="text" defaultValue={item.unit} />
        </td>
        <td>
          <input id={item.id + "rate"} type="text" defaultValue={item.rate} />
        </td>
        <td>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => this.deleteCMTItem(item.id)}
          >
            <AiTwotoneDelete />
          </button>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => this.editCMTItem(item.id)}
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

  componentDidMount = () => {
    this.handleCMTItemsImport();
  };

  handleCMTItemsImport = () => {
    db.collection("CMT")
      .get()
      .then((snapshot) => {
        let pvtCMTItemsArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtCMTItemsArray.push(data);
        });
        this.setState({
          CMTItemsArray: pvtCMTItemsArray,
        });
      })
      .catch((error) => console.log(error));
  };

  pushNewData = () => {
    let addedId = document.getElementById("customRowId").value;
    let addedActivity = document.getElementById("customRowActivity").value;
    let addedUnit = document.getElementById("customRowUnit").value;
    let addedRate = document.getElementById("customRowRate").value;

    db.collection("CMT").doc(addedId).set({
      activity: addedActivity,
      unit: addedUnit,
      rate: addedRate,
      id: addedId,
    });

    this.handleCMTItemsImport();
    this.deleteCustomRowData();
  };

  deleteCustomRowData = () => {
    document.getElementById("customRowId").value = "";
    document.getElementById("customRowActivity").value = "";
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
          Activity: <input id="customRowActivity" />
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

  render() {
    return (
      <div id="main_table">
        <header>
          <NavBar />
        </header>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Activity</th>
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
            {this.getCMTTableContent()}
            {this.state.customRowAddBool ? this.addCustomRow() : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AdminPageCMT;
