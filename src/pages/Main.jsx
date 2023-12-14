import React from "react";
import { Navbar, Nav, CloseButton, Button } from 'react-bootstrap';
import ReflashButton from "../components/ReflashButton.jsx";
import Toast from '../toast.jsx';

import './Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastOpen: false,
      toastTitle: '',
      toastMessage: '',
    };

    let tool = window.location.pathname.replace('/', '');
    if (tool === '') {
      tool = window.localStorage.getItem('main-currentTool') || 'websocket';
      this.navigateTo(tool);
    } else {
      this.currentTool = tool;
    }
  }

  navigateTo = (tool) => {
    let newUrl = window.location.origin + '/' + tool;
    window.location.href = newUrl;
  }

  handleTabSelect = (tool) => {
    window.localStorage.setItem('main-currentTool', tool);
    this.navigateTo(tool);
  }

  handleToastOpen = (title, message, dismiss = 5) => {
    console.log("Toast:", title, message);
    this.setState({
      toastOpen: true,
      toastTitle: title,
      toastMessage: message,
    })
    if (dismiss > 0) {
      setTimeout(this.handleToastClose, dismiss * 1000)
    }
  }

  handleToastClose = () => {
    this.setState({
      toastOpen: false,
      toastTitle: '',
      toastMessage: '',
    });
  }

  render() {
    let toolComponent = <h3>没有这个工具：{this.currentTool}</h3>;
    this.props.tools.forEach((tool, index) => {
      if (tool.path === this.currentTool) {
        toolComponent = <tool.component key={index} toast={this.handleToastOpen} />;
      }
    });
    return <div className="main">
      <Navbar className="main-navbar" bg="primary" data-bs-theme="dark" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Navbar.Brand href="/home">差不多工具箱</Navbar.Brand>
        <Nav className="me-auto" activeKey={this.currentTool} onSelect={this.handleTabSelect}>
          {this.props.tools.map((tool, index) =>
            <Nav.Link key={index} eventKey={tool.path}>{tool.name}</Nav.Link>
          )}
        </Nav>
        <ReflashButton onClick={() => window.location.reload()} />
        <CloseButton onClick={() => window.close()} />
      </Navbar>
      <div className="content">
        {toolComponent}
      </div>
      <Toast
        open={this.state.toastOpen}
        onClose={this.handleToastClose}
        title={this.state.toastTitle}
        message={this.state.toastMessage}
      />
    </div >
  }
}

export default Main;