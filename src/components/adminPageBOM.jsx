import React, { Component } from "react";
import NavBar from "./navBar";
import { db, auth } from "../services/firebase";
import { Table } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiTwotoneDelete } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";

class AdminPageBOM extends Component {
  state = {
    BOMItemsArray: [],
    customRowAddBool: false,
  };

  getBOMTableContent = () => {
    //BOM TABLE CONTENT RENDER
    this.handleBOMItemsImport();

    return this.state.BOMItemsArray.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>
          <input type="text" defaultValue={item.name} />
        </td>
        <td>
          <input type="text" defaultValue={item.type} />
        </td>
        <td>
          <input type="text" defaultValue={item.unit} />
        </td>
        <td>
          <input type="text" defaultValue={item.rate} />
        </td>
      </tr>
    ));
  };

  handleBOMItemsImport = () => {
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

    db.collection("BOM").add({
      name: addedName,
      type: addedType,
      unit: addedUnit,
      rate: addedRate,
      id: addedId,
    });

    this.handleBOMItemsImport();
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
            {this.getBOMTableContent()}{" "}
            {this.state.customRowAddBool ? this.addCustomRow() : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AdminPageBOM;
