import React, { Component } from "react";
import { DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { FaTshirt } from "react-icons/fa";

//map each <Dropdown.Item> to an element in array later on
const PatternDropdown = (props) => {
  const { label, uploadedPatternFiles, drawPattern } = props;
  var componentFiles = uploadedPatternFiles;

  return (
    <React.Fragment>
      <style type="text/css">
        {`
    .btn-flat {
      background-color: #007bff;
      color: white;
    }
    `}
      </style>
      <DropdownButton
        as={ButtonGroup}
        title={label}
        id="bg-vertical-dropdown-1"
        variant="flat"
      >
        {componentFiles.map((comp) => (
          <Dropdown.Item key={comp.size} onClick={() => drawPattern(comp.comp)}>
            {comp.name}
          </Dropdown.Item>
        ))}
        {/* <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item> */}
      </DropdownButton>
    </React.Fragment>
  );
};

export default PatternDropdown;
