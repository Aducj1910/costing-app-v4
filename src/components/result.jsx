import React, { Component } from "react";
import { Table } from "react-bootstrap";
import NavBar from "./navBar";

class ResultPage extends Component {
  state = {};

  renderCostEstimates = () => {
    console.log(this.props.BOM);
    return this.props.BOM.map((item) => (
      <tr>
        <td>{item.name}</td>
      </tr>
    ));
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Table>
          <thead>
            <th>Item name</th>
            <th>Item type</th>
            <th>Item consumption</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Est. Cost</th>
          </thead>
          {this.renderCostEstimates()}
        </Table>
      </div>
    );
  }
}

export default ResultPage;
