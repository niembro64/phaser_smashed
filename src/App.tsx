import { useState } from "react";
import "./App.css";

function App() {
  const [debug, getDebug] = useState(true);

  return (
    <>
      {/* <h1>SMASHED 69 {{ debug } ? "(DEBUG MODE)" : ""}</h1> */}
      <div id="phaser-container"></div>
    </>
  );
}

export default App;
