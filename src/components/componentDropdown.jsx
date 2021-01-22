import React, { Component } from "react";
import { DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { FaTshirt } from "react-icons/fa";

//map each <Dropdown.Item> to an element in array later on
const ComponentDropdown = (props) => {
  const {
    label,
    uploadedComponentFiles,
    importedComponentFiles,
    drawComponent,
  } = props;
  var componentFiles = importedComponentFiles;

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
        {importedComponentFiles.map((comp) => (
          <Dropdown.Item
            onClick={() => drawComponent(comp.comp, comp.name)}
            key={comp.name}
          >
            {comp.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </React.Fragment>
  );
};

export default ComponentDropdown;
