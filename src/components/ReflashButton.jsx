import React from "react";

import { ArrowClockwise } from 'react-bootstrap-icons';

import './ReflashButton.css';

const ReflashButton = (props) => {
  return <div className="reflash-button" onClick={props.onClick}>
    <ArrowClockwise size="24" />
  </div >
}

export default ReflashButton;