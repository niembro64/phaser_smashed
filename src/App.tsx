import { useState } from "react";
import "./App.css";

function App() {
  const [debug, getDebug] = useState(true);
  const [numControllers, getNumController] = useState(0);

  return (
    <>
      {/* <div id="top-bar">
        <h1 id="title">SMASHED</h1>
        <h1 id="title">{{ debug } ? "DEBUGGING" : ""}</h1>
        <h1 id="title"># Controllers: {numControllers}</h1>
        <h1 id="boy"># Controllers: {numControllers}</h1>
      </div> */}
      <div id="phaser-container"></div>
    </>
  );
}

export default App;
