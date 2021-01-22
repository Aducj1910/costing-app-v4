import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const NavBar = (props) => {
  const { onCanvasScreen } = props;

  const getBarType = () => {
    if (onCanvasScreen) {
      return (
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand>Costing</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/add-component" target="_blank">
              Dashboard
            </Nav.Link>
          </Nav>
        </Navbar>
      );
    } else {
      return (
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand>Costing</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/add-component">
              Add Component
            </Nav.Link>
            {/* <Nav.Link href="#features">Features</Nav.Link> */}
            <Nav.Link as={Link} to="/admin-bom">
              BOM
            </Nav.Link>
            <Nav.Link as={Link} to="/admin-cmt">
              CMT
            </Nav.Link>
          </Nav>
        </Navbar>
      );
    }
  };

  return <React.Fragment>{getBarType()}</React.Fragment>;
};

export default NavBar;
