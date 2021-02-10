import React, { Component } from "react";
import { Row, Table } from "react-bootstrap";
import NavBar from "./navBar";
import { AiTwotoneDelete } from "react-icons/ai";

class ConfigPage extends Component {
  state = {};

  getBOMStuff = () => {
    console.log(this.props.config);
    return this.props.config.map((item) => (
      <tr>
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
            <th>Item name</th>
            <th>Item type</th>
            <th>Consumption</th>
            <th>
              <p></p>
            </th>
          </thead>
          {this.getBOMStuff()}
        </Table>
      </div>
    );
  }
}

export default ConfigPage;
