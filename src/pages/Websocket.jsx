import React from "react";
import { Container, Button, Spinner, Card, Form, InputGroup, Nav, FloatingLabel } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Editor from '@monaco-editor/react';

import './Websocket.css';

const DataType = [
  "int8",
  "uint8",
  "int16",
  "uint16",
  "int32",
  "uint32",
  "int64",
  "uint64",
  "float32",
  "float64",
]

class Websocket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlProtocol: "ws://",
      urlHostname: "",
      urlPort: "",
      url: "",
      connectionState: 'disconnected',
      ws: null,
      sendMode: "text",
      sendTextBuffer: "",
      sendJSONBuffer: "",
      sendArrayBufferData: [],
      sendArrayBufferType: [],
    }
  }

  connectWs = (url) => {
    console.log("connecting to", url);
    let ws;
    ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("connected");
      this.props.toast("成功", "连接成功");
      this.setState({ connectionState: "connected" });
    }
    ws.onmessage = (e) => {
      console.log(e.data);
    }
    ws.onclose = () => {
      console.log("disconnected");
      this.props.toast("", "连接断开");
      this.setState({ connectionState: "disconnected" });
    }
    ws.onerror = (e) => {
      console.log(e);
      this.props.toast("连接失败", e);
    }
    this.setState({ ws: ws });
  }

  handleConnect = () => {
    let url = this.state.urlProtocol + this.state.urlHostname + ":" + this.state.urlPort;
    window.localStorage.setItem("websocket-urlProtocol", this.state.urlProtocol);
    window.localStorage.setItem("websocket-urlHostname", this.state.urlHostname);
    window.localStorage.setItem("websocket-urlPort", this.state.urlPort);
    this.connectWs(url);
    this.setState({
      connectionState: "connecting",
      url: url
    });
  }

  handleDisconnect = () => {
    if (this.state.ws) {
      this.state.ws.close();
      this.props.toast("成功", "断开连接");
    } else {
      this.props.toast("错误", "未连接服务器");
      console.log("未连接服务器");
    }
    this.setState({ connectionState: "disconnecting" });
  }

  connectionCheck = () => {
    if (this.state.ws && this.state.ws.readyState === WebSocket.OPEN) {
      return true;
    } else {
      this.props.toast("错误", "未连接服务器，请先连接");
      console.log("未连接服务器，请先连接");
      return false;
    }
  }

  handleModeChange = (mode) => {
    window.localStorage.setItem("websocket-sendMode", mode);
    this.setState({ sendMode: mode });
  }

  handleSendText = () => {
    window.localStorage.setItem("websocket-sendTextBuffer", this.state.sendTextBuffer);
    if (this.state.ws) {
      this.state.ws.send(this.state.sendTextBuffer);
    }
  }

  handleSendJSON = () => {
    window.localStorage.setItem("websocket-sendJSONBuffer", this.state.sendJSONBuffer);
    let jsonString = JSON.stringify(JSON.parse(this.state.sendJSONBuffer));
    console.log("sendJSONBuffer", jsonString);
    if (this.state.ws) {
      this.state.ws.send(jsonString);
    }
  }

  handleSendArrayBufferAddDataPiece = () => {
    let arrayBufferType = this.state.sendArrayBufferType;
    let arrayBufferData = this.state.sendArrayBufferData;
    arrayBufferType.push([]);
    arrayBufferData.push([]);
    window.localStorage.setItem("websocket-sendArrayBufferType", JSON.stringify(arrayBufferType));
    window.localStorage.setItem("websocket-sendArrayBufferData", JSON.stringify(arrayBufferData));
    this.setState({
      sendArrayBufferType: arrayBufferType,
      sendArrayBufferData: arrayBufferData,
    });
  }

  handleSendArrayBufferAddData = (index, type) => {
    let arrayBufferType = this.state.sendArrayBufferType;
    let arrayBufferData = this.state.sendArrayBufferData;
    arrayBufferType[index].push(type);
    arrayBufferData[index].push(0);
    window.localStorage.setItem("websocket-sendArrayBufferType", JSON.stringify(arrayBufferType));
    window.localStorage.setItem("websocket-sendArrayBufferData", JSON.stringify(arrayBufferData));
    this.setState({
      sendArrayBufferType: arrayBufferType,
      sendArrayBufferData: arrayBufferData,
    });
  }

  handleSendArrayBufferDeleteData = (index) => {
    console.log("handleSendArrayBufferDeleteData", document.activeElement);
    let arrayBufferType = this.state.sendArrayBufferType;
    let arrayBufferData = this.state.sendArrayBufferData;
    arrayBufferType[index].pop();
    arrayBufferData[index].pop();
    window.localStorage.setItem("websocket-sendArrayBufferType", JSON.stringify(arrayBufferType));
    window.localStorage.setItem("websocket-sendArrayBufferData", JSON.stringify(arrayBufferData));
    this.setState({
      sendArrayBufferType: arrayBufferType,
      sendArrayBufferData: arrayBufferData,
    });
  }

  handleSendArrayBufferDataChange = (dataPieceIndex, dataIndex, value) => {
    console.log("handleSendArrayBufferDataChange", dataPieceIndex, dataIndex, value);
    let arrayBufferData = this.state.sendArrayBufferData;
    arrayBufferData[dataPieceIndex][dataIndex] = value;
    window.localStorage.setItem("websocket-sendArrayBufferData", JSON.stringify(arrayBufferData));
    this.setState({ sendArrayBufferData: arrayBufferData })
  }

  handleSendArrayBufferData = (dataIndex) => {
    console.log("handleSendArrayBufferData", dataIndex);
    let arrayBufferType = this.state.sendArrayBufferType;
    let arrayBufferData = this.state.sendArrayBufferData;
    let arrayBuffer = new ArrayBuffer(arrayBufferType[dataIndex].length);
    let dataView = new DataView(arrayBuffer);
    for (let i = 0; i < arrayBufferType[dataIndex].length; i++) {
      let type = arrayBufferType[dataIndex][i];
      let data = arrayBufferData[dataIndex][i];
      switch (type) {
        case "int8": dataView.setInt8(i, data); break;
        case "uint8": dataView.setUint8(i, data); break;
        case "int16": dataView.setInt16(i, data); break;
        case "uint16": dataView.setUint16(i, data); break;
        case "int32": dataView.setInt32(i, data); break;
        case "uint32": dataView.setUint32(i, data); break;
        case "int64": dataView.setBigInt64(i, data); break;
        case "uint64": dataView.setBigUint64(i, data); break;
        case "float32": dataView.setFloat32(i, data); break;
        case "float64": dataView.setFloat64(i, data); break;
        default: break;
      }
    }
    console.log("arrayBuffer", arrayBuffer);
    window.localStorage.setItem("websocket-sendArrayBufferType", JSON.stringify(this.state.sendArrayBufferType));
    window.localStorage.setItem("websocket-sendArrayBufferData", JSON.stringify(this.state.sendArrayBufferData));
    if (this.connectionCheck()) {
      this.state.ws.send(arrayBuffer);
    }
  }

  componentDidMount() {
    let urlProtocol = window.localStorage.getItem("websocket-urlProtocol") || "ws://";
    let urlHostname = window.localStorage.getItem("websocket-urlHostname") || "";
    let urlPort = window.localStorage.getItem("websocket-urlPort") || "";
    let sendMode = window.localStorage.getItem("websocket-sendMode") || "text";
    let sendTextBuffer = window.localStorage.getItem("websocket-sendTextBuffer") || "";
    let sendJSONBuffer = window.localStorage.getItem("websocket-sendJSONBuffer") || "{}";
    let sendArrayBufferType = window.localStorage.getItem("websocket-sendArrayBufferType") || "[]";
    let sendArrayBufferData = window.localStorage.getItem("websocket-sendArrayBufferData") || "[]";
    sendJSONBuffer = JSON.stringify(JSON.parse(sendJSONBuffer), null, 2);
    this.setState({
      urlProtocol: urlProtocol,
      urlHostname: urlHostname,
      urlPort: urlPort,
      sendMode: sendMode,
      sendTextBuffer: sendTextBuffer,
      sendJSONBuffer: sendJSONBuffer,
      sendArrayBufferType: JSON.parse(sendArrayBufferType),
      sendArrayBufferData: JSON.parse(sendArrayBufferData),
    });
  }

  render() {
    return <Container fluid className="websocket" style={{ marginTop: "20px" }}>
      {/* 连接输入组 */}
      <InputGroup className="mb-3">
        <Dropdown
          onSelect={(e) => this.setState({ urlProtocol: e })}>
          <DropdownButton
            variant="outline-secondary"
            title={this.state.urlProtocol}
            id="input-group-dropdown-1"
          >
            <Dropdown.Item eventKey="ws://">ws://</Dropdown.Item>
            <Dropdown.Item eventKey="wss://">wss://</Dropdown.Item>
          </DropdownButton>
        </Dropdown>
        <Form.Control
          placeholder="ip"
          aria-label="hostname"
          aria-describedby="basic-addon1"
          value={this.state.urlHostname}
          onChange={(e) => this.setState({ urlHostname: e.target.value })}
        />
        <Form.Control
          placeholder="端口"
          aria-label="port"
          aria-describedby="basic-addon1"
          value={this.state.urlPort}
          onChange={(e) => this.setState({ urlPort: e.target.value })}
        />
        {this.state.connectionState === "connected" &&
          <Button variant="danger" id="button-addon2" onClick={this.handleDisconnect}>
            断开连接
          </Button>}
        {this.state.connectionState === "disconnected" &&
          <Button variant="primary" id="button-addon2" onClick={this.handleConnect}>
            连接
          </Button>}
        {this.state.connectionState === "connecting" &&
          <Button variant="primary" id="button-addon2" disabled>
            <Spinner animation="border" size="sm" variant="light" />
          </Button>}
        {this.state.connectionState === "disconnecting" &&
          <Button variant="primary" id="button-addon2" disabled>
            <Spinner animation="border" size="sm" variant="light" />
          </Button>}
      </InputGroup>
      {/* 发送卡片 */}
      <Card>
        <Card.Header>
          <Nav fill variant="tabs" activeKey={this.state.sendMode} onSelect={this.handleModeChange}>
            <Nav.Item>
              <Nav.Link eventKey="text">字符串</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="json">JSON</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="arrayBuffer">数组</Nav.Link>
            </Nav.Item>
          </Nav></Card.Header>
        <Card.Body>
          {this.state.sendMode === "text" && <>
            <Form.Control as="textarea" rows={3} value={this.state.sendTextBuffer} onChange={(e) => this.setState({ sendTextBuffer: e.target.value })} />
            <Button onClick={this.handleSendText}>发送</Button>
          </>}
          {this.state.sendMode === "json" && <>
            <Editor height="30vh" defaultLanguage="json" value={this.state.sendJSONBuffer} onChange={(e) => this.setState({ sendJSONBuffer: e })} />
            <Button onClick={this.handleSendJSON}>发送</Button>
          </>}
          {this.state.sendMode === "arrayBuffer" && <>
            {this.state.sendArrayBufferType.map((dataPiece, dataPieceIndex) => {
              return <InputGroup className="mb-3" key={dataPieceIndex}>
                {dataPiece.map((dataType, dataIndex) => {
                  return <FloatingLabel label={dataType}>
                    <Form.Control
                      className="sendArrayBufferDataInput"
                      placeholder={dataType}
                      value={this.state.sendArrayBufferData[dataPieceIndex][dataIndex]}
                      onChange={(e) => this.handleSendArrayBufferDataChange(dataPieceIndex, dataIndex, e.target.value)}>
                    </Form.Control>
                  </FloatingLabel>
                })}
                <Dropdown onSelect={(type) => this.handleSendArrayBufferAddData(dataPieceIndex, type)}>
                  <DropdownButton
                    variant="outline-secondary"
                    title="+"
                    id="input-group-dropdown-1">
                    {DataType.map((type, index) => {
                      return <Dropdown.Item key={index} eventKey={type}>{type}</Dropdown.Item>
                    })}
                  </DropdownButton>
                </Dropdown>
                <Button variant="danger" onClick={() => this.handleSendArrayBufferDeleteData(dataPieceIndex)}>-</Button>
                <Button variant="primary" onClick={() => this.handleSendArrayBufferData(dataPieceIndex)}>Send</Button>
              </InputGroup>
            })}
            <Button onClick={this.handleSendArrayBufferAddDataPiece}>添加条目</Button>
          </>}

        </Card.Body>
      </Card>
      {/* 接收卡片 */}
      <Card style={{ marginTop: "20px" }}>
        <Card.Header>接收数据</Card.Header>
        <Card.Body>
        </Card.Body>
      </Card>
    </Container >
  }
}

export default Websocket;