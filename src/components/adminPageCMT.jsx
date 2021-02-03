import React, { Component } from "react";
import NavBar from "./navBar";
import { db, auth } from "../services/firebase";
import { Table } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiTwotoneDelete } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";

class AdminPageCMT extends Component {
  state = {
    CMTItemsArray: [],
    customRowAddBool: false,
  };

  getCMTTableContent = () => {
    //CMT TABLE CONTENT RENDER
    return this.state.CMTItemsArray.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>
          <input type="text" defaultValue={item.activity} />
        </td>
        <td>
          <input type="text" defaultValue={item.unit} />
        </td>
        <td>
          <input type="text" defaultValue={item.rate} />
        </td>
        <td>
          <button style={{ background: "none", border: "none" }}>
            <AiTwotoneDelete />
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

    db.collection("CMT").add({
      activity: addedActivity,
      unit: addedUnit,
      rate: addedRate,
      id: addedId,
    });

    this.handleCMTItemsImport();
  };

  deleteCustomRowData = () => {
    document.getElementById("customRowId").value = "";
    document.getElementById("customRowActivity").value = "";
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
            {this.getCMTTableContent()}{" "}
            {this.state.customRowAddBool ? this.addCustomRow() : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AdminPageCMT;
