import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
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
            <Nav.Link as={Link} to="/component" target="_blank">
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
            <NavDropdown title="Add">
              <NavDropdown.Item href="/component">
                Component/Silhouette
              </NavDropdown.Item>
              <NavDropdown.Item href="/pattern">Pattern</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Manage">
              <NavDropdown.Item href="/manage-component">
                Component
              </NavDropdown.Item>
              <NavDropdown.Item href="/manage-pattern">
                Pattern
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Data">
              <NavDropdown.Item href="/admin-bom">BOM</NavDropdown.Item>
              <NavDropdown.Item href="/admin-cmt">CMT</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      );
    }
  };

  return <React.Fragment>{getBarType()}</React.Fragment>;
};

export default NavBar;
