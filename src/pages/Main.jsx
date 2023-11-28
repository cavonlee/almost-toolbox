import React from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import Toast from '../toast.jsx';

import './Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastOpen: false,
      toastTitle: '',
      toastMessage: '',
      currentTool: 'websocket',
    };
  }

  componentDidMount() {
    let path = window.location.pathname;
    path = path.replace('/', '');
    console.log("Path:", path);
    let currentTool = '';
    if (path === '') {
      currentTool = window.localStorage.getItem('main-currentTool') || 'websocket';
    } else {
      currentTool = path;
    }
    this.setState({
      currentTool: currentTool
    });
  }

  handleTabSelect = (tool) => {
    window.localStorage.setItem('main-currentTool', tool);
    this.setState({
      currentTool: tool
    });
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
    let avaliableTools = this.props.tools.map((tool) => tool.path);

    return <div className="main">
      <Navbar className="main-navbar" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/home">工具箱</Navbar.Brand>
          <Nav className="me-auto" activeKey={this.state.currentTool} onSelect={this.handleTabSelect}>
            {this.props.tools.map((tool, index) =>
              <Nav.Link key={index} eventKey={tool.path}>{tool.name}</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <div className="content">
        {avaliableTools.indexOf(this.state.currentTool) === -1 ?
          <h3>没有这个工具：{this.state.currentTool}</h3> :
          this.props.tools.map((tool, index) => {
            if (tool.path === this.state.currentTool) {
              return <tool.component key={index} toast={this.handleToastOpen} />
            }
          })}
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