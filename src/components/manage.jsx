import React, { Component } from "react";
import NavBar from "./navBar";
import { db } from "../services/firebase";
import { Table, Form, Row } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible, AiTwotoneDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import ConfigPage from "./configPage";

//PROPS IMPORTED
//switch = silhoutte/component/pattern

class Manage extends Component {
  state = { switchArray: [], imgColHidden: false };

  componentDidMount = () => {
    this.importContent();
  };

  importContent = () => {
    db.collection(this.props.switch)
      .get()
      .then((snapshot) => {
        let pvtSwitchArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pvtSwitchArray.push(data);
        });
        this.setState({ switchArray: pvtSwitchArray });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onDelete = (id) => {
    db.collection(this.props.switch)
      .doc(id)
      .delete()
      .then(
        function () {
          this.importContent();
        }.bind(this)
      )
      .catch((error) => console.log(error));
  };

  renderSwitch = () => {
    return this.state.switchArray.map((item) => (
      <tr height={this.state.imgColHidden ? null : 150}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        {this.state.imgColHidden ? (
          <p></p>
        ) : (
          <img src={item.comp} height={150} />
        )}
        <td>
          <Link to={"/config" + this.props.switch + item.id}>Config</Link>
        </td>
        <td width={10}>
          <button
            style={{ outline: "none", border: "none", background: "none" }}
            onClick={() => this.onDelete(item.id)}
          >
            <AiTwotoneDelete />
          </button>
        </td>
      </tr>
    ));
  };

  toggleImgColHidden = () => {
    this.setState({ imgColHidden: !this.state.imgColHidden });
  };

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <Table striped bordered hover>
          <thead>
            <th width={100}>Id</th>
            <th width={500}>Name</th>
            <th width={100}>
              Image
              <button
                style={{ border: "none", background: "none", outline: 0 }}
                onClick={() => this.toggleImgColHidden()}
              >
                {this.state.imgColHidden ? (
                  <AiFillEyeInvisible />
                ) : (
                  <AiFillEye />
                )}
              </button>
            </th>
            <th width={100}>Config</th>
          </thead>
          <tbody>{this.renderSwitch()}</tbody>
        </Table>
      </div>
    );
  }
}

export default Manage;
