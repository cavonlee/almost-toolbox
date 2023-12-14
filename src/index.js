import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from "./pages/Main";
import Websocket from "./pages/Websocket";
import ResisterDivider from './pages/ResisterDivider';
import SerialTool from './pages/SerialTool';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const Tools = [
  { name: "Websocket", path: "websocket", component: Websocket },
  { name: "电阻分压计算器", path: "resister-divider", component: ResisterDivider },
  { name: "串口工具", path: "serial-tool", component: SerialTool },

]

export default function App() {
  return (
    <Main tools={Tools} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);