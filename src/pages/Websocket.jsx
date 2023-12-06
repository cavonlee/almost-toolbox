import React, {
  useState,
} from "react";
import {
  Container,
  Button,
  ToggleButton,
  ButtonGroup,
  Spinner,
  Card,
  Form,
  InputGroup,
  FloatingLabel,
  ListGroup,
  Stack,
  CloseButton,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import Editor from '@monaco-editor/react';

import './Websocket.css';

const DataType = [
  { name: "Int8", id: "int8", setFunc: "setInt8", length: 1 },
  { name: "Uint8", id: "uint8", setFunc: "setUint8", length: 1 },
  { name: "Int16", id: "int16", setFunc: "setInt16", length: 2 },
  { name: "Uint16", id: "uint16", setFunc: "setUint16", length: 2 },
  { name: "Int32", id: "int32", setFunc: "setInt32", length: 4 },
  { name: "Uint32", id: "uint32", setFunc: "setUint32", length: 4 },
  { name: "Int64", id: "int64", setFunc: "setBigInt64", length: 8 },
  { name: "Uint64", id: "uint64", setFunc: "setBigUint64", length: 8 },
  { name: "Float32", id: "float32", setFunc: "setFloat32", length: 4 },
  { name: "Float64", id: "float64", setFunc: "setFloat64", length: 8 },
]

const BinaryType = [
  { name: "Blob", id: "blob" },
  { name: "ArrayBuffer", id: "arraybuffer" },
]

const Websocket = (props) => {
  const [urlProtocol, setUrlProtocol] = useState(window.localStorage.getItem("websocket-urlProtocol") || "ws://");
  const [urlHostname, setUrlHostname] = useState(window.localStorage.getItem("websocket-urlHostname") || "");
  const [urlPort, setUrlPort] = useState(window.localStorage.getItem("websocket-urlPort") || "");
  const [connectionState, setConnectionState] = useState('disconnected');
  const [ws, setWs] = useState(null);
  const [receivedData, setReceivedData] = useState([]);

  const connectWs = (url) => {
    let ws;
    ws = new WebSocket(url);
    ws.onopen = () => {
      props.toast("成功", "连接成功");
      setConnectionState("connected");
    }
    ws.onmessage = (e) => {
      console.log(e.data);
      setReceivedData(receivedData.concat(e.data));
    }
    ws.onclose = () => {
      props.toast("", "连接断开");
      setConnectionState("disconnected");
    }
    ws.onerror = (e) => {
      props.toast("连接失败", e);
    }
    setWs(ws);
  }

  const handleConnect = () => {
    let url = urlProtocol + urlHostname + ":" + urlPort;
    window.localStorage.setItem("websocket-urlProtocol", urlProtocol);
    window.localStorage.setItem("websocket-urlHostname", urlHostname);
    window.localStorage.setItem("websocket-urlPort", urlPort);
    connectWs(url);
    setConnectionState("connecting");
  }

  const handleDisconnect = () => {
    if (ws) {
      ws.close();
      props.toast("成功", "断开连接");
    } else {
      props.toast("错误", "未连接服务器");
    }
    setConnectionState("disconnected");
  }

  const connectionCheck = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return true;
    } else {
      props.toast("错误", "未连接服务器，请先连接");
      return false;
    }
  }

  const handleSend = (data) => {
    if (connectionCheck()) {
      ws.send(data);
    }
  }

  const handleBinaryTypeChanged = (type) => {
    console.log(type);
    if (!connectionCheck()) return;
    ws.binaryType = type;
  }

  return <Container className="websocket" style={{ marginTop: "20px" }} >
    {/* 连接输入组 */}
    < InputGroup className="mb-3" >
      <Dropdown
        onSelect={(e) => setUrlProtocol(e)}>
        <DropdownButton
          variant="outline-secondary"
          title={urlProtocol}
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
        value={urlHostname}
        onChange={(e) => setUrlHostname(e.target.value)}
      />
      <Form.Control
        placeholder="端口"
        aria-label="port"
        aria-describedby="basic-addon1"
        value={urlPort}
        onChange={(e) => setUrlPort(e.target.value)}
      />
      {connectionState === "connected" &&
        <Button variant="danger" id="button-addon2" onClick={handleDisconnect}> 断开连接 </Button>}
      {connectionState === "disconnected" &&
        <Button variant="primary" id="button-addon2" onClick={handleConnect}>连接</Button>}
      {connectionState === "connecting" &&
        <Button variant="primary" id="button-addon2" disabled><Spinner animation="border" size="sm" variant="light" /></Button>}
      {connectionState === "disconnecting" &&
        <Button variant="primary" id="button-addon2" disabled><Spinner animation="border" size="sm" variant="light" /></Button>}
    </InputGroup >
    {/* 接收卡片 */}
    < ReceiveCard data={receivedData} onBinaryTypeChanged={handleBinaryTypeChanged} />
    {/* 发送卡片 */}
    < SendCard onSend={handleSend} />
  </Container >
}

const SendCard = (props) => {
  const _sendDataBuffer = window.localStorage.getItem("websocket-sendDataBuffer") || "[]";
  const [sendDataBuffer, setSendDataBuffer] = useState(JSON.parse(_sendDataBuffer));

  const updateSendDataBuffer = (buffer) => {
    window.localStorage.setItem("websocket-sendDataBuffer", JSON.stringify(buffer));
    setSendDataBuffer(buffer);
  }

  const handleCheckDataPeice = (index, checked) => {
    console.log(index, checked);
    let buffer = [...sendDataBuffer];
    buffer[index].checked = checked;
    updateSendDataBuffer(buffer);
  }

  const handleAddDataPeice = (type) => {
    updateSendDataBuffer((buffer) => {
      switch (type) {
        case "text": buffer.push({ type: "text", data: "", checked: false }); break;
        case "json": buffer.push({ type: "json", data: {}, checked: false }); break;
        case "array": buffer.push({ type: "array", data: [], checked: false }); break;
        default: break;
      }
      return buffer;
    });
  }

  const handleTextChange = (index, e) => {
    let buffer = [...sendDataBuffer];
    buffer[index].data = e.target.value;
    updateSendDataBuffer(buffer);
  }

  const handleJSONChange = (index, e) => {
    let buffer = [...sendDataBuffer];
    try {
      buffer[index].data = JSON.parse(e.target.value);
      updateSendDataBuffer(buffer);
    } catch (error) {
      console.log(error);
    }
  }

  const handleArrayChange = (index, unitIndex, e) => {
    let buffer = [...sendDataBuffer];
    let data = e.target.value;
    buffer[index].data[unitIndex].data = data;
    updateSendDataBuffer(buffer);
  }

  const handleArrayAddUnit = (index, typeIndex) => {
    let buffer = [...sendDataBuffer];
    buffer[index].data.push({ typeIndex: typeIndex, data: null, });
    updateSendDataBuffer(buffer);
  }

  const handleArrayDeleteUnit = (index, unitIndex) => {
    let buffer = [...sendDataBuffer];
    if (unitIndex === undefined) {
      unitIndex = buffer[index].data.length - 1;
    }
    buffer[index].data.splice(unitIndex, 1);
    updateSendDataBuffer(buffer);
  }

  const getData = (dataPiece) => {
    let data;
    switch (dataPiece.type) {
      case "text":
        data = dataPiece.data;
        return data;
      case "json":
        data = JSON.stringify(dataPiece.data);
        return data;
      case "array":
        data = new ArrayBuffer(dataPiece.data.length);
        let dataView = new DataView(data);
        for (let i = 0; i < dataPiece.data.length; i++) {
          let unit = dataPiece.data[i];
          let typeIndex = unit.typeIndex;
          let dataType = DataType[typeIndex];
          dataView[dataType.setFunc](i, unit.data); i += dataType.length - 1;
        }
        return data;
      default:
        return "";
    }
  }

  const getToSendData = () => {
    let toSendData = "";
    sendDataBuffer.forEach((dataPiece) => {
      if (!dataPiece.checked) {
        return;
      }
      switch (dataPiece.type) {
        case "text": toSendData += dataPiece.data; break;
        case "json": toSendData += JSON.stringify(dataPiece.data); break;
        case "array":
          let datas = [];
          dataPiece.data.forEach((unit) => {
            datas.push(unit.data);
          });
          toSendData += "[" + datas.join(", ") + "]";
          break;
        default: break;
      }
    });
    return toSendData;
  }

  const handleDeleteDataPiece = (index) => {
    let buffer = [...sendDataBuffer];
    buffer.splice(index, 1);
    updateSendDataBuffer(buffer);
  }

  const handleMoveDataPiece = (index, direction) => {
    let buffer = [...sendDataBuffer];
    let temp = buffer[index];
    buffer.splice(index, 1);
    buffer.splice(index + direction, 0, temp);
    updateSendDataBuffer(buffer);
  }

  const handleSendPack = () => {
    sendDataBuffer.forEach((dataPiece) => {
      if (!dataPiece.checked) {
        return;
      }
      let data = getData(dataPiece);
      props.onSend(data);
    });
  }

  const handleSend = (index) => {
    let dataPiece = sendDataBuffer[index];
    let data = getData(dataPiece);
    props.onSend(data);
  }


  return <Card style={{ marginTop: "20px" }} >
    <Card.Header as="h5">
      <Stack direction="horizontal" gap={1}>
        <h5>发送数据</h5>
        <Dropdown className="ms-auto" onSelect={handleAddDataPeice}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            添加条目
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="text">文本</Dropdown.Item>
            <Dropdown.Item eventKey="json">JSON</Dropdown.Item>
            <Dropdown.Item eventKey="array">数组</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
    </Card.Header>
    {sendDataBuffer.length === 0 && <Card.Body>
      <Card.Text>请添加条目</Card.Text>
    </Card.Body>}
    <ListGroup variant="flush">
      {sendDataBuffer.map((dataPiece, dataPieceIndex) => {
        let component = <></>;
        switch (dataPiece.type) {
          case "text":
            component = <Form.Control
              placeholder="输入需要发送的字符串"
              as="textarea"
              rows={3}
              value={dataPiece.data}
              onChange={(e) => handleTextChange(dataPieceIndex, e)}
            />
            break;
          case "json":
            component = <Editor
              height="10vh"
              defaultLanguage="json"
              width="91.8%"
              value={JSON.stringify(dataPiece.data, null, 2)}
              onChange={(e) => handleJSONChange(dataPieceIndex, e)}
            />
            break;
          case "array":
            component = <>
              {dataPiece.data.length === 0 ?
                <InputGroup.Text>添加一个数据</InputGroup.Text>
                : dataPiece.data.map((dataUnit, dataUnitIndex) => {
                  let type = dataUnit.type;
                  return <FloatingLabel label={type} key={dataUnitIndex}>
                    <Form.Control
                      className="sendArrayBufferDataInput"
                      placeholder={type}
                      value={dataUnit.data}
                      onChange={(e) => handleArrayChange(dataPieceIndex, dataUnitIndex, e)}>
                    </Form.Control>
                    <CloseButton
                      onClick={() => handleArrayDeleteUnit(dataPieceIndex, dataUnitIndex)}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                      }} />
                  </FloatingLabel>
                })}
              <Dropdown onSelect={(type) => handleArrayAddUnit(dataPieceIndex, type)}>
                <DropdownButton
                  variant="outline-secondary"
                  title="+"
                  id="input-group-dropdown-1">
                  {DataType.map((type, index) => {
                    return <Dropdown.Item key={index} eventKey={index}>{type.name}</Dropdown.Item>
                  })}
                </DropdownButton>
              </Dropdown>
            </>
            break;
          default: break;
        }
        return <ListGroup.Item key={dataPieceIndex}>
          <InputGroup>
            {/* 拖拽条目 */}
            <Form.Check
              type='checkbox'
              checked={dataPiece.checked || false}
              aria-label={dataPieceIndex}
              onChange={(e) => handleCheckDataPeice(dataPieceIndex, e.target.checked)}
              style={{ margin: "auto 10px auto 0", fontSize: "x-large" }} />
            <ButtonGroup vertical size='sm'>
              <Button variant="outline-secondary" style={{ paddingTop: 0, paddingBottom: 0 }} onClick={() => handleMoveDataPiece(dataPieceIndex, -1)}>
                <Icon.CaretUpFill className="dragIcon" size={14} />
              </Button>
              <Button variant="outline-secondary" style={{ paddingTop: 0, paddingBottom: 0 }} onClick={() => handleMoveDataPiece(dataPieceIndex, 1)}>
                <Icon.CaretDownFill className="dragIcon" size={14} />
              </Button>
            </ButtonGroup>
            {component}
            <Button variant="danger" onClick={(e) => handleDeleteDataPiece(dataPieceIndex)}>删除</Button>
            <Button onClick={handleSend}>发送</Button>
          </InputGroup>
        </ListGroup.Item>
      })}
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
        <span>合并发送数据："{getToSendData()}"</span>
        <Button onClick={handleSendPack}>发送</Button>
      </ListGroup.Item>
    </ListGroup>
  </Card >
}

const ReceiveCard = (props) => {
  const [binaryType, setBinaryType] = useState(window.localStorage.getItem("webSocket-binaryType") || "arraybuffer");

  const handleBinaryTypeChanged = (e) => {
    let type = e.currentTarget.value;
    setBinaryType(type);
    window.localStorage.setItem("webSocket-binaryType", type);
    props.onBinaryTypeChanged(type);
  }

  return <Card style={{ marginTop: "20px" }}>
    <Card.Header as="h5">
      <Stack direction="horizontal" gap={1}>
        <h5>接收数据</h5>
        <ButtonGroup className="ms-auto">
          {BinaryType.map((type, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant='outline-primary'
              name="radio"
              value={type.id}
              checked={binaryType === type.id}
              onChange={handleBinaryTypeChanged}
            >
              {type.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Stack>
    </Card.Header>
    {props.data.length === 0 && <Card.Body>
      <Card.Text>没有数据</Card.Text>
    </Card.Body>}
    <ListGroup variant="flush">
      {props.data.map((data, index) => {
        console.log(data);
        let component;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
            component = <Editor
              key={index}
              height="10vh"
              defaultLanguage="json"
              width="91.8%"
              value={JSON.stringify(data, null, 2)}
            />
          } catch (e) {
            component = <Card.Text key={index}>{data}</Card.Text>
          }
        } else if (typeof data === "arraybuffer") {
          component = <Card.Text key={index}>{data}</Card.Text>
        }
        return <ListGroup.Item>{component}</ListGroup.Item>
      })}
    </ListGroup>
  </Card >
}

export default Websocket;