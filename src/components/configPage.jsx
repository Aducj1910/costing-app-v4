import React, { Component } from "react";
import { Row, Table } from "react-bootstrap";
import NavBar from "./navBar";
import { AiTwotoneDelete } from "react-icons/ai";

class ConfigPage extends Component {
  state = {};

  getBOM = () => {
    return this.props.config.map((item) => (
      <tr key={item.name}>
        <td>{item.name}</td>
        <td>{item.type}</td>
        <td>
          <input type="text" defaultValue={item.consumption} />
        </td>
        <td>
          <button style={{ border: "none", background: "none" }}>
            <AiTwotoneDelete />
          </button>
        </td>
      </tr>
    ));
  };

  getCMT = () => {
    return this.props.CMT_config.map((item) => (
      <tr key={item.activity}>
        <td>{item.activity}</td>
        <td>
          <input type="text" defaultValue={item.consumption} />
        </td>
        <td>
          <button style={{ border: "none", background: "none" }}>
            {" "}
            <AiTwotoneDelete />
          </button>
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
        <Row className="m-2 row justify-content-center align-self-center">
          <h4>{"[" + this.props.id + "]" + " " + this.props.name}</h4>
        </Row>
        <Table striped bordered hover>
          <thead>
            <th>BOM Item name</th>
            <th>Item type</th>
            <th>Consumption</th>
            <th>
              <p></p>
            </th>
          </thead>
          <tbody>{this.getBOM()}</tbody>
        </Table>
        <Table striped bordered hover>
          <thead>
            <th>CMT Activity</th>
            <th>Consumption</th>
            <th>
              <p></p>
            </th>
          </thead>
          <tbody>{this.getCMT()}</tbody>
        </Table>
      </div>
    );
  }
}

export default ConfigPage;
