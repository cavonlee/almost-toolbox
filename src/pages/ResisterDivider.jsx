import React, {
  useState,
} from "react";
import {
  Card,
  Container,
  Row,
  Table,
  Col,
  FloatingLabel,
  Form,
  Button,
  InputGroup,
  Dropdown,
  DropdownButton,
  Stack,
} from 'react-bootstrap';
import resisterDividerSchematic from '../assets/schematic.jpg';
import { roundString, value2Number, number2Value } from '../js/utils.js';

import './ResisterDivider.css';

const PrecisionList = [
  0.1, 0.5, 1, 5, 10,
]

const ResistorList = {
  3: [
    "1.0", "2.2", "4.7",
    "10", "22", "47",
    "100", "220", "470",
    "1k", "2.2k", "4.7k",
    "10k", "22k", "47k",
    "100k", "220k", "470k",
    "1M", "2.2M", "4.7M",
    "10M"
  ],
  6: [
    "1.0", "1.5", "2.2", "3.3", "4.7", "6.8",
    "10", "15", "22", "33", "47", "68",
    "100", "150", "220", "330", "470", "680",
    "1K", "1.5K", "2.2K", "3.3K", "4.7K", "6.8K",
    "10K", "15K", "22K", "33K", "47K", "68K",
    "100K", "150K", "220K", "330K", "470K", "680K",
    "1M", "1.5M", "2.2M", "3.3M", "4.7M", "6.8M",
    "10M",
  ],
  12: [
    "1.0", "1.2", "1.5", "1.8", "2.2", "2.7", "3.3", "3.9", "4.7", "5.6", "6.8", "8.2",
    "10", "12", "15", "18", "22", "27", "33", "39", "47", "56", "68", "82",
    "100", "120", "150", "180", "220", "270", "330", "390", "470", "560", "680", "820",
    "1K", "1.2K", "1.5K", "1.8K", "2.2K", "2.7K", "3.3K", "3.9K", "4.7K", "5.6K", "6.8K", "8.2K",
    "10K", "12K", "15K", "18K", "22K", "27K", "33K", "39K", "47K", "56K", "68K", "82K",
    "100K", "120K", "150K", "180K", "220K", "270K", "330K", "390K", "470K", "560K", "680K", "820K",
    "1M", "1.2M", "1.5M", "1.8M", "2.2M", "2.7M", "3.3M", "3.9M", "4.7M", "5.6M", "6.8M", "8.2M",
    "10M",
  ],
  24: [
    "1.0", "1.1", "1.2", "1.3", "1.5", "1.6", "1.8", "2.0", "2.2", "2.4", "2.7", "3.0",
    "3.3", "3.6", "3.9", "4.3", "4.7", "5.1", "5.6", "6.2", "6.8", "7.5", "8.2", "9.1",
    "10", "11", "12", "13", "15", "16", "18", "20", "22", "24", "27", "30", "33",
    "36", "39", "43", "47", "51", "56", "62", "68", "75", "82", "91",
    "100", "110", "120", "130", "150", "160", "180", "200", "220", "240", "270", "300", "330",
    "360", "390", "430", "470", "510", "560", "620", "680", "750", "820", "910",
    "1K", "1.1K", "1.2K", "1.3K", "1.5K", "1.6K", "1.8K", "2K", "2.2K", "2.4K", "2.7K", "3K", "3.3K",
    "3.6K", "3.9K", "4.3K", "4.7K", "5.1K", "5.6K", "6.2K", "6.8K", "7.5K", "8.2K", "9.1K",
    "10K", "11K", "12K", "13K", "15K", "16K", "18K", "20K", "22K", "24K", "27K", "30K", "33K",
    "36K", "39K", "43K", "47K", "51K", "56K", "62K", "68K", "75K", "82K", "91K",
    "100K", "110K", "120K", "130K", "150K", "160K", "180K", "200K", "220K", "240K", "270K", "300K", "330K",
    "360K", "390K", "430K", "470K", "510K", "560K", "620K", "680K", "750K", "820K", "910K",
    "1M", "1.1M", "1.2M", "1.3M", "1.5M", "1.6M", "1.8M", "2M", "2.2M", "2.4M", "2.7M", "3M", "3.3M",
    "3.6M", "3.9M", "4.3M", "4.7M", "5.1M", "5.6M", "6.2M", "6.8M", "7.5M", "8.2M", "9.1M",
    "10M", "15M", "22M",
  ],
  48: [
    "1.00", "1.05", "1.10", "1.15", "1.21", "1.27", "1.33", "1.40", "1.47", "1.54", "1.62", "1.69", "1.78", "1.87", "1.96", "2.05", "2.15", "2.26", "2.37", "2.49", "2.61", "2.74", "2.87", "3.01",
    "3.16", "3.32", "3.48", "3.65", "3.83", "4.02", "4.22", "4.42", "4.64", "4.87", "5.11", "5.36", "5.62", "5.90", "6.19", "6.49", "6.81", "7.15", "7.50", "7.87", "8.25", "8.66", "9.09", "9.53",
    "10.0", "10.5", "11.0", "11.5", "12.1", "12.7", "13.3", "14.0", "14.7", "15.4", "16.2", "16.9", "17.8", "18.7", "19.6", "20.5", "21.5", "22.6", "23.7", "24.9", "26.1", "27.4", "28.7", "30.1",
    "31.6", "33.2", "34.8", "36.5", "38.3", "40.2", "42.2", "44.2", "46.4", "48.7", "51.1", "53.6", "56.2", "59.0", "61.9", "64.9", "68.1", "71.5", "75.0", "78.7", "82.5", "86.6", "90.9", "95.3",
    "100", "105", "110", "115", "121", "127", "133", "140", "147", "154", "162", "169", "178", "187", "196", "205", "215", "226", "237", "249", "261", "274", "287", "301",
    "316", "332", "348", "365", "383", "402", "422", "442", "464", "487", "511", "536", "562", "590", "619", "649", "681", "715", "750", "787", "825", "866", "909", "953",
    "1.00K", "1.05K", "1.10K", "1.15K", "1.21K", "1.27K", "1.33K", "1.40K", "1.47K", "1.54K", "1.62K", "1.69K", "1.78K", "1.87K", "1.96K", "2.05K", "2.15K", "2.26K", "2.37K", "2.49K", "2.61K", "2.74K", "2.87K", "3.01K",
    "3.16K", "3.32K", "3.48K", "3.65K", "3.83K", "4.02K", "4.22K", "4.42K", "4.64K", "4.87K", "5.11K", "5.36K", "5.62K", "5.90K", "6.19K", "6.49K", "6.81K", "7.15K", "7.50K", "7.87K", "8.25K", "8.66K", "9.09K", "9.53K",
    "10.0K", "10.5K", "11.0K", "11.5K", "12.1K", "12.7K", "13.3K", "14.0K", "14.7K", "15.4K", "16.2K", "16.9K", "17.8K", "18.7K", "19.6K", "20.5K", "21.5K", "22.6K", "23.7K", "24.9K", "26.1K", "27.4K", "28.7K", "30.1K",
    "31.6K", "33.2K", "34.8K", "36.5K", "38.3K", "40.2K", "42.2K", "44.2K", "46.4K", "48.7K", "51.1K", "53.6K", "56.2K", "59.0K", "61.9K", "64.9K", "68.1K", "71.5K", "75.0K", "78.7K", "82.5K", "86.6K", "90.9K", "95.3K",
    "100K", "105K", "110K", "115K", "121K", "127K", "133K", "140K", "147K", "154K", "162K", "169K", "178K", "187K", "196K", "205K", "215K", "226K", "237K", "249K", "261K", "274K", "287K", "301K",
    "316K", "332K", "348K", "365K", "383K", "402K", "422K", "442K", "464K", "487K", "511K", "536K", "562K", "590K", "619K", "649K", "681K", "715K", "750K", "787K", "825K", "866K", "909K", "953K",
    "1.00M", "1.05M", "1.10M", "1.15M", "1.21M", "1.27M", "1.33M", "1.40M", "1.47M", "1.54M", "1.62M", "1.69M", "1.78M", "1.87M", "1.96M", "2.05M", "2.15M", "2.26M", "2.37M", "2.49M", "2.61M", "2.74M", "2.87M", "3.01M",
    "3.16M", "3.32M", "3.48M", "3.65M", "3.83M", "4.02M", "4.22M", "4.42M", "4.64M", "4.87M", "5.11M", "5.36M", "5.62M", "5.90M", "6.19M", "6.49M", "6.81M", "7.15M", "7.50M", "7.87M", "8.25M", "8.66M", "9.09M", "9.53M",
    "10.0M", "10.5M", "11.0M", "11.5M", "12.1M", "12.7M", "13.3M", "14.0M", "14.7M", "15.4M", "16.2M", "16.9M", "17.8M", "18.7M", "19.6M", "20.5M", "21.5M", "22.6M", "23.7M", "24.9M", "26.1M", "27.4M", "28.7M", "30.1M",
  ]
}

const ResisterDivider = (props) => {
  let _series = Number(window.localStorage.getItem("resistorDivider-resistorSeries") || 24);
  let _precision = Number(window.localStorage.getItem("resistorDivider-resistorPrecision") || 1);
  let _calculateAcuracy = Number(window.localStorage.getItem("resistorDivider-calculateAcuracy") || 2);
  let _inR1 = window.localStorage.getItem("resistorDivider-inR1") || "";
  let _inR2 = window.localStorage.getItem("resistorDivider-inR2") || "";
  let _inVin = window.localStorage.getItem("resistorDivider-inVin") || "";
  let _inVout = window.localStorage.getItem("resistorDivider-inVout") || "";
  const [resistorSeries, setResistorSeries] = useState(_series);
  const [resistorPrecision, setResistorPrecision] = useState(_precision);
  const [calculateAcuracy, setCalculateAcuracy] = useState(_calculateAcuracy);
  const [inR1, setInR1] = useState(_inR1);
  const [inR2, setInR2] = useState(_inR2);
  const [inVin, setInVin] = useState(_inVin);
  const [inVout, setInVout] = useState(_inVout);
  const [outputTitle, setOutputTitle] = useState("");
  const [result, setResult] = useState({});

  const renderResistorTable = () => {
    let resistorList = ResistorList[resistorSeries];
    if (!resistorList) return null;
    let rows = [];
    let colLength = 12;
    for (let i = 0; i < resistorList.length;) {
      let cols = [];
      for (let j = 0; j < colLength; j++) {
        cols.push(<td>{resistorList[i]}</td>);
        i += 1;
      }
      rows.push(<tr>{cols}</tr>);
    }
    return (
      <Card style={{ marginTop: "20px" }}>
        <Card.Header>
          电阻表 E{resistorSeries}
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }

  const handleSeriesChange = (e) => {
    let series = e.target.value;
    window.localStorage.setItem("resistorDivider-resistorSeries", series);
    setResistorSeries(series);
  }

  const handlePrecisionChange = (e) => {
    let precision = e.target.value;
    window.localStorage.setItem("resistorDivider-resistorPrecision", precision);
    setResistorPrecision(precision);
  }

  const handleCalculateAcuracyChange = (eventKey) => {
    let acuracy = eventKey;
    window.localStorage.setItem("resistorDivider-calculateAcuracy", acuracy);
    setCalculateAcuracy(acuracy, handleCalculate);
  }

  const getStandardResistor = (value) => {
    let resistorList = ResistorList[resistorSeries];
    let minError = 100000000;
    let minErrorIndex = 0;
    for (let i = 0; i < resistorList.length; i++) {
      value = value2Number(value);
      let refValue = value2Number(resistorList[i]);
      let error = Math.abs(value - refValue);
      if (error < minError) {
        minError = error;
        minErrorIndex = i;
      }
    }
    let result = resistorList[minErrorIndex];
    result = value2Number(result);
    return result;
  }

  const handleCalculateError = (messge) => {
    setOutputTitle(messge);
    setResult({});
  }

  const handleCalculate = () => {
    let r1 = value2Number(inR1);
    let r2 = value2Number(inR2);
    let vin = value2Number(inVin);
    let vout = value2Number(inVout);
    if (r1 === "" && r2 !== "" && vin !== "" && vout !== "") {
      calculateR1();
    } else if (r1 !== "" && r2 === "" && vin !== "" && vout !== "") {
      calculateR2();
    } else if (r1 !== "" && r2 !== "" && vin === "" && vout !== "") {
      calculateVin();
    } else if (r1 !== "" && r2 !== "" && vin !== "" && vout === "") {
      calculateVout();
    } else if (r1 === "" && r2 === "" && vin !== "" && vout !== "") {
      calculateR1R2();
    } else if (r1 !== "" && r2 !== "" && vin !== "" && vout !== "") {
      handleCalculateError("你什么都有了， 那。。。我算什么？");
    } else if (r1 === "" && r2 === "" && vin === "" && vout === "") {
      handleCalculateError("你什么都没有，怎么算？");
    } else if (r1 !== "" && r2 === "" && vin === "" && vout === "") {
      handleCalculateError("只有R1，怎么算？");
    } else if (r1 === "" && r2 !== "" && vin === "" && vout === "") {
      handleCalculateError("只有R2，怎么算？");
    } else if (r1 === "" && r2 === "" && vin !== "" && vout === "") {
      handleCalculateError("只有VIN，怎么算？");
    } else if (r1 === "" && r2 === "" && vin === "" && vout !== "") {
      handleCalculateError("只有VOUT，怎么算？");
    }
  }

  const calculateR1 = () => {
    let result = {};
    let _inR2 = value2Number(inR2);
    let _inVin = value2Number(inVin);
    let _inVout = value2Number(inVout);
    let outR1 = _inVin / _inVout * _inR2 - _inR2;
    result["直接结果"] = [outR1, _inR2, _inVin, _inVout, "0%"];

    let standardR1 = getStandardResistor(outR1);

    // 锁定Vin 计算标准R1下的Vout，得出误差
    let lockVinVout = _inVin * _inR2 / (standardR1 + _inR2);
    let lockVinError = (lockVinVout - _inVout) / _inVout * 100;
    lockVinError = roundString(lockVinError, calculateAcuracy);
    lockVinError = lockVinError + "%";
    result["锁定Vin"] = [standardR1, _inR2, _inVin, lockVinVout, lockVinError];

    // 锁定Vout 计算标准R1下的Vin，得出误差
    let lockVoutVin = _inVout * (standardR1 + _inR2) / _inR2
    let lockVoutError = (lockVoutVin - _inVin) / _inVin * 100;
    lockVoutError = roundString(lockVoutError, calculateAcuracy);
    lockVoutError = lockVoutError + "%";
    result["锁定Vout"] = [standardR1, _inR2, lockVoutVin, _inVout, lockVoutError];

    setOutputTitle("计算R1:");
    setResult(result);
  }

  const calculateR2 = () => {
    let result = {};
    let _inR1 = value2Number(inR1);
    let _inVin = value2Number(inVin);
    let _inVout = value2Number(inVout);
    let outR2 = _inR1 * _inVout / (_inVin - _inVout);
    result["直接结果"] = [_inR1, outR2, _inVin, _inVout, "0%"];

    // 获取标准电阻
    let standardR2 = getStandardResistor(outR2);

    // 锁定Vin 计算标准R2下的Vout，得出误差
    let lockVinVout = _inVin * standardR2 / (_inR1 + standardR2);
    let lockVinError = (lockVinVout - _inVout) / _inVout * 100;
    lockVinError = roundString(lockVinError, calculateAcuracy);
    lockVinError = lockVinError + "%";
    result["锁定Vin"] = [_inR1, standardR2, _inVin, lockVinVout, lockVinError];

    // 锁定Vout 计算标准R2下的Vin，得出误差
    let lockVoutVin = _inVout * (_inR1 + standardR2) / standardR2
    let lockVoutError = (lockVoutVin - _inVout) / _inVout * 100;
    lockVoutError = roundString(lockVoutError, calculateAcuracy);
    lockVoutError = lockVoutError + "%";
    result["锁定Vout"] = [_inR1, standardR2, lockVoutVin, _inVout, lockVoutError];

    setOutputTitle("计算R2:");
    setResult(result);
  }

  const calculateVin = () => {
    let r1 = value2Number(inR1);
    let r2 = value2Number(inR2);
    let vout = value2Number(inVout);
    let vin = vout * (r1 + r2) / r2
    let r1Min = r1 * (1 - resistorPrecision / 100);
    let r1Max = r1 * (1 + resistorPrecision / 100);
    let r2Min = r2 * (1 - resistorPrecision / 100);
    let r2Max = r2 * (1 + resistorPrecision / 100);
    let vinList = [];
    vinList.push(vout * (r1Min + r2Min) / r2Min);
    vinList.push(vout * (r1Min + r2Max) / r2Max);
    vinList.push(vout * (r1Max + r2Min) / r2Min);
    vinList.push(vout * (r1Max + r2Max) / r2Max);
    let vinMin = Math.min(...vinList);
    let vinMax = Math.max(...vinList);
    let errorRate = (vinMax - vinMin) / vinMax * 100;
    r1Min = number2Value(r1Min);
    r1Max = number2Value(r1Max);
    r2Min = number2Value(r2Min);
    r2Max = number2Value(r2Max);
    vinMin = roundString(vinMin, calculateAcuracy);
    vinMax = roundString(vinMax, calculateAcuracy);
    errorRate = roundString(errorRate, calculateAcuracy);
    let result = {
      "直接结果": [r1, r2, vin, vout, "0%"],
      "误差范围": [`${r1Min} ~ ${r1Max}`, `${r2Min} ~ ${r2Max}`, `${vinMin} ~ ${vinMax}`, vout, errorRate + '%'],
    }
    setOutputTitle("计算Vin:");
    setResult(result);
  }

  const calculateVout = () => {
    console.log("calculateVout");
    let result = {};
    let r1 = value2Number(inR1);
    let r2 = value2Number(inR2);
    let vin = value2Number(inVin);
    let vout = vin * r2 / (r1 + r2);
    vout = roundString(vout, calculateAcuracy);
    result["直接结果"] = [r1, r2, vin, vout, "0%"];

    let r1Min = r1 * (1 - resistorPrecision / 100);
    let r1Max = r1 * (1 + resistorPrecision / 100);
    let r2Min = r2 * (1 - resistorPrecision / 100);
    let r2Max = r2 * (1 + resistorPrecision / 100);
    let voutList = [];
    voutList.push(vin * r2Min / (r1Min + r2Min));
    voutList.push(vin * r2Min / (r1Max + r2Min));
    voutList.push(vin * r2Max / (r1Min + r2Max));
    voutList.push(vin * r2Max / (r1Max + r2Max));
    let voutMin = Math.min(...voutList);
    let voutMax = Math.max(...voutList);
    let errorRate = (voutMax - voutMin) / voutMin * 100;
    r1Min = number2Value(r1Min);
    r1Max = number2Value(r1Max);
    r2Min = number2Value(r2Min);
    r2Max = number2Value(r2Max);
    voutMin = roundString(voutMin, calculateAcuracy);
    voutMax = roundString(voutMax, calculateAcuracy);
    errorRate = roundString(errorRate, calculateAcuracy);
    result["误差范围"] = [`${r1Min} ~ ${r1Max}`, `${r2Min} ~ ${r2Max}`, vin, `${voutMin} ~ ${voutMax}`, errorRate + '%'];

    setOutputTitle("计算Vout:");
    setResult(result);
  }

  const calculateR1R2 = () => {
    let vin = value2Number(inVin);
    let vout = value2Number(inVout);
    let resistorList = ResistorList[resistorSeries];
    let minimalError = Infinity;
    let outR1, outR2;
    for (let i = 0; i < resistorList.length; i++) {
      for (let j = 0; j < resistorList.length; j++) {
        let _r1 = resistorList[i];
        let _r2 = resistorList[j];
        _r1 = value2Number(_r1);
        _r2 = value2Number(_r2);
        let _vout = vin * _r2 / (_r1 + _r2);
        let error = _vout - vout;
        error = Math.abs(error);
        if (error < minimalError) {
          outR1 = _r1;
          outR2 = _r2;
          minimalError = error;
          console.log("R1: ", _r1, "R2: ", _r2, "Error: ", error);
        }
      }
    }
    let actualVout = roundString(vin * outR2 / (outR1 + outR2), calculateAcuracy);
    let actualVoutError = roundString((actualVout - vout) / vout * 100, calculateAcuracy) + "%";
    let actualVin = roundString(vout * (outR1 + outR2) / outR2, calculateAcuracy);
    let actualVinError = roundString((actualVin - vin) / vin * 100, calculateAcuracy) + "%";
    let result = {
      "直接结果": [outR1, outR2, "-", "-", "0%"],
      "以Vin为准Vout实际结果": [outR1, outR2, vin, actualVout, actualVoutError],
      "以Vout为准Vin实际结果": [outR1, outR2, actualVin, vout, actualVinError],
    }

    setOutputTitle("计算R1和R2:");
    setResult(result);
  }

  const handleR1Change = (event) => {
    window.localStorage.setItem("resistorDivider-inR1", event.target.value);
    setInR1(event.target.value, this.handleCalculate);
  }

  const handleR2Change = (event) => {
    window.localStorage.setItem("resistorDivider-inR2", event.target.value);
    setInR2(event.target.value, this.handleCalculate);
  }

  const handleVinChange = (event) => {
    window.localStorage.setItem("resistorDivider-inVin", event.target.value);
    setInVin(event.target.value, this.handleCalculate);
  }

  const handleVoutChange = (event) => {
    window.localStorage.setItem("resistorDivider-inVout", event.target.value);
    setInVout(event.target.value, this.handleCalculate);
  }

  const renderResult = () => {
    if (outputTitle === "") {
      return <div></div>
    }

    return <div>
      <Stack direction="horizontal" gap={1}>
        <h5 style={{ textAlign: "justify", margin: "20px 0" }}>
          {outputTitle}
        </h5>
        <DropdownButton
          id="dropdown-basic-button"
          title={`计算精度：${calculateAcuracy}位`}
          variant="outline-secondary"
          size="sm"
          className="ms-auto"
          onSelect={handleCalculateAcuracyChange}
        >
          <Dropdown.Item eventKey="0">0</Dropdown.Item>
          <Dropdown.Item eventKey="1">1</Dropdown.Item>
          <Dropdown.Item eventKey="2">2</Dropdown.Item>
          <Dropdown.Item eventKey="3">3</Dropdown.Item>
          <Dropdown.Item eventKey="4">4</Dropdown.Item>
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="6">6</Dropdown.Item>
        </DropdownButton>
      </Stack>

      {Object.keys(result).length !== 0 && <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>R1</th>
            <th>R2</th>
            <th>Vin</th>
            <th>Vout</th>
            <th>精度</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(result).map((key, index) => {
            return <tr key={index}>
              <td>{key}</td>
              {result[key].map((item, index) => {
                return <td key={index}>{number2Value(item)}</td>
              })}
            </tr>
          })}
        </tbody>
      </Table>}
    </div>
  }

  return <Container className="resister-divider">
    <Card>
      <Card.Header style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        电阻分压计算
      </Card.Header>
      <Card.Body>
        <Row>
          <Col sm={2} className="resister-divider-schematic-image-container">
            <img className="resister-divider-schematic-image" src={resisterDividerSchematic} alt="resistor-divider" />
          </Col>
          <Col style={{ marginLeft: "20px" }}>
            <h5 style={{ textAlign: "justify", margin: "20px 0" }}>
              输入下面部分参数，点击计算，即可计算出其他参数
            </h5>
            <Row>
              <Col sm={2}>
                <FloatingLabel controlId="floatingSelect" label="电阻系列">
                  <Form.Select value={resistorSeries} onChange={handleSeriesChange}>
                    {Object.keys(ResistorList).map((key, index) => {
                      return <option key={index} value={key}>E{key}</option>
                    })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col sm={2}>
                <FloatingLabel controlId="floatingSelect" label="电阻精度">
                  <Form.Select value={resistorPrecision} onChange={handlePrecisionChange}>
                    {PrecisionList.map((item, index) => {
                      return <option key={index} value={item}>{item}%</option>
                    })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col>
                <InputGroup>
                  <FloatingLabel label="R1">
                    <Form.Control value={inR1} onChange={handleR1Change} />
                  </FloatingLabel>
                  <FloatingLabel label="R2">
                    <Form.Control value={inR2} onChange={handleR2Change} />
                  </FloatingLabel>
                  <FloatingLabel label="VIN">
                    <Form.Control value={inVin} onChange={handleVinChange} />
                  </FloatingLabel>
                  <FloatingLabel label="VOUT">
                    <Form.Control value={inVout} onChange={handleVoutChange} />
                  </FloatingLabel>
                  <Button variant="primary" onClick={handleCalculate}>计算</Button>
                </InputGroup>
              </Col>
            </Row>
            {renderResult()}
          </Col>
        </Row>
      </Card.Body>
    </Card >

    {renderResistorTable()}
  </Container >
}

export default ResisterDivider;
