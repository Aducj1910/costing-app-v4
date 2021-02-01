import React, { Component, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

const AdminGetItemType = (props) => {
  const [titleTxt, setTitleTxt] = useState("Select Type"); //React hook
  const { rawArray, inRow, onItemTypeSelected } = props;
  
  let typeArray = [];
  rawArray.forEach((element) => {
    if (typeArray.includes(element.type)) {
    } else {
      typeArray.push(element.type);
    }
  });

  const handleOnClick = (element) => {
    setTitleTxt(element);
    onItemTypeSelected(inRow, element);
  };

  return (
    <DropdownButton title={titleTxt}>
      {typeArray.map((element) => (
        <Dropdown.Item key={element} onClick={() => handleOnClick(element)}>
          {element}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default AdminGetItemType;
