import React, { Component } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

class ToastConponent extends Component {
  render() {
    return (<ToastContainer
      className="p-3"
      position="top-start"
      style={{ zIndex: 999 }}>
      {this.props.open && <Toast onClose={this.props.onClose}>
        <Toast.Header>
          <strong className="me-auto">{this.props.title}</strong>
        </Toast.Header>
        <Toast.Body>{this.props.message}</Toast.Body>
      </Toast>}
    </ToastContainer>
    );
  }
}

export default ToastConponent;
