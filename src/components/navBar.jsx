import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const NavBar = () => {
  return (
    <React.Fragment>
      <Navbar bg="primary" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand href="/">Costing</Navbar.Brand>
        </LinkContainer>
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
    </React.Fragment>
  );
};

export default NavBar;
