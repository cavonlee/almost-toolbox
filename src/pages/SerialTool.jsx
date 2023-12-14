import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  InputGroup,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
  ListGroup,
  Container,
  Card,
  FloatingLabel,
  Form,
  ToggleButton,
} from 'react-bootstrap';

const BAUDRATE_LIST = [300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600, 1000000, 2000000];
const PARITY_LIST = ["none", "even", "odd", "mark", "space"];
const STOPBITS_LIST = [1, 1.5, 2];
const DATABITS_LIST = [5, 6, 7, 8];


const SerialTool = (props) => {
  const [showPortSelector, setShowPortSelector] = useState(false);
  const [portList, setPortList] = useState([]);
  const [port, setPort] = useState(null);
  const [portInfo, setPortInfo] = useState(null);
  const [baudrate, setBaudrate] = useState(115200);
  const [parity, setParity] = useState("none");
  const [stopbits, setStopbits] = useState(1);
  const [databits, setDatabits] = useState(8);

  const [connected, setConnected] = useState(false);
  const [receivedData, setReceivedData] = useState("");

  document.addEventListener('onSerialDeviceFound', (event) => {
    setPortList(event.detail);
  });

  const refreshPortList = async () => {
    setShowPortSelector(true);
    try {
      let port = await navigator.serial.requestPort({})
      setPort(port);
    } catch (ex) {
      if (ex.message == "Failed to execute 'requestPort' on 'Serial': No port selected by the user.") {
        return;
      }
      props.toast("错误", ex.message);
    }
  }

  const selectPort = async (index) => {
    try {
      let port = portList[index];
      console.log(index, port);
      const event = new CustomEvent('onSelectedSerialDevice', { detail: port.portId });
      document.dispatchEvent(event);
      setPortInfo(port);
      setShowPortSelector(false);
    } catch (ex) {
      props.toast("错误", "串口选择失败");
    }
  }

  const readLoop = async () => {
    let reader = port.readable.getReader();
    while (port) {
      console.log(receivedData);
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      let data = new TextDecoder().decode(value);
      let history = window.localStorage.getItem("serialTool-receiveHistory") || "";
      history += data;
      window.localStorage.setItem("serialTool-receiveHistory", history);
      setReceivedData(history);
    }
  }

  const connect = async () => {
    if (port) {
      try {
        try {
          await port.close();
        } catch (ex) {

        }
        await port.open({ baudRate: baudrate, parity: parity, stopBits: stopbits, dataBits: databits });
        props.toast("成功", "串口连接成功");
        setConnected(true);
        readLoop();
      } catch (ex) {
        props.toast("错误", ex.message);
      }
    } else {
      props.toast("错误", "串口未选择");
    }
  }

  const disconnect = async () => {
    if (port) {
      try {
        await port.close();
        props.toast("成功", "串口断开成功");
      } catch (ex) {
        props.toast("错误", ex.message);
      }
    } else {
      props.toast("错误", "串口未选择");
    }
    setPort(null);
    setPortInfo(null);
    setConnected(false);
  }

  const handleCancelSelect = () => {
    setShowPortSelector(false);
    const event = new CustomEvent('onCanceledSerialDevice', { detail: "Canceled" });
    document.dispatchEvent(event);
  }

  const handleReceiveCleared = () => {
    window.localStorage.setItem("serialTool-receiveHistory", "");
    setReceivedData("");
  }

  return <Container>
    <InputGroup className="mb-3">
      <Button variant="outline-secondary" onClick={refreshPortList}>
        {portInfo ? `${portInfo.displayName}(${portInfo.portName})` : "选择串口"}
      </Button>
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title={baudrate ? baudrate : "选择波特率"}
        id="input-group-dropdown-2"
      >
        {BAUDRATE_LIST.map((baudrate, index) => {
          return <Dropdown.Item key={index} onClick={() => setBaudrate(baudrate)}>{baudrate}</Dropdown.Item>
        }
        )}
      </DropdownButton>
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title={parity ? parity : "选择校验位"}
        id="input-group-dropdown-2"
      >
        {PARITY_LIST.map((parity, index) => {
          return <Dropdown.Item key={index} onClick={() => setParity(parity)}>{parity}</Dropdown.Item>
        })}
      </DropdownButton>
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title={stopbits ? stopbits : "选择停止位"}
        id="input-group-dropdown-2"
      >
        {STOPBITS_LIST.map((stopbits, index) => {
          return <Dropdown.Item key={index} onClick={() => setStopbits(stopbits)}>{stopbits}</Dropdown.Item>
        })}
      </DropdownButton>
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title={databits ? databits : "选择数据位"}
        id="input-group-dropdown-2"
      >
        {DATABITS_LIST.map((databits, index) => {
          return <Dropdown.Item key={index} onClick={() => setDatabits(databits)}>{databits}</Dropdown.Item>
        })}
      </DropdownButton>
      {!connected && <Button variant="primary" id="button-addon2" onClick={connect}>连接</Button>}
      {connected && <Button variant="danger" id="button-addon2" onClick={disconnect}>断开</Button>}
    </InputGroup>
    <SerialPortSelector show={showPortSelector} onHide={handleCancelSelect} portList={portList} onChange={selectPort} />
    <SerialReaderCard data={receivedData} onClear={handleReceiveCleared} />
  </Container>
}

const SerialPortSelector = (props) => {
  return <Modal show={props.show} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <ListGroup variant="flush">
      {props.portList.map((port, index) => {
        return <ListGroup.Item key={index} onClick={() => props.onChange(index)}>{`${port.displayName}(${port.portName})`}</ListGroup.Item>
      })}
    </ListGroup>
  </Modal>
}

const SerialReaderCard = (props) => {
  const [enableDateTime, setEnableDateTime] = useState(window.localStorage.getItem("serialTool-enableDateTime") === "true");
  const [enableAutoScroll, setEnableAutoScroll] = useState(window.localStorage.getItem("serialTool-enableAutoScroll") === "true");

  const [filters, setFilters] = useState(window.localStorage.getItem("serialTool-filters") || "");

  useEffect(() => {
    endItem.current.scrollIntoView({ behavior: "smooth" });
  }, [props.data]);

  const handleFiltersChanged = (event) => {
    console.log(event.target.value);
    setFilters(event.target.value);
  }

  const handleEnableDateTimeChanged = (event) => {
    console.log(event.target.checked);
    setEnableDateTime(event.target.checked);
    window.localStorage.setItem("serialTool-enableDateTime", event.target.checked);
  }

  const handleEnableAutoScrollChanged = (event) => {
    console.log(event.target.checked);
    setEnableAutoScroll(event.target.checked);
    window.localStorage.setItem("serialTool-enableAutoScroll", event.target.checked);
  }

  const endItem = useRef(null);
  const dataList = props.data.split("\r\n");

  return <Card>
    <Card.Header>接收到数据</Card.Header>
    <InputGroup>
      <FloatingLabel
        controlId="floatingInput"
        label="Filters"
      >
        <Form.Control type="text" onChange={handleFiltersChanged} value={filters} />
      </FloatingLabel>
      <InputGroup.Checkbox title="自动滚动" checked={enableAutoScroll} onChange={handleEnableAutoScrollChanged} />
      <ToggleButton
        id="toggle-check"
        type="checkbox"
        variant="outline-secondary"
        checked={enableDateTime}
        onChange={handleEnableDateTimeChanged}
      >
        时间戳
      </ToggleButton>
      <Button variant='outline-secondary' size='sm' onClick={props.onClear}>
        清空
      </Button>
    </InputGroup>
    <div style={{ height: "500px", overflowY: "scroll" }}>
      <ListGroup variant="flush">
        {dataList.map((data, index) => {
          if (data === "") {
            return null;
          }
          if (filters !== "") {
            let filterList = filters.split(" ");
            for (let i = 0; i < filterList.length; i++) {
              let filter = filterList[i];
              if (filter.startsWith("-")) {
                filter = filter.substring(1);
                if (filter === "") continue;
                if (data.indexOf(filter) >= 0) {
                  return null;
                }
              } else {
                if (data.indexOf(filter) < 0) {
                  return null;
                }
              }
            }
          }
          return <ListGroup.Item key={index} style={{ textAlign: "left" }}>
            {data}
          </ListGroup.Item>
        })}
        <ListGroup.Item ref={endItem}></ListGroup.Item>
      </ListGroup>
    </div>
  </Card >
}

export default SerialTool;