import React from "react";
import logo from "./logo.svg";
import "./App.css";
import phaserGame from "./PhaserGame";
import HelloWorldScene from "./scenes/Game";

function App() {
    return (
        <body>
            <header className="App-header">
                <div id="game"></div>
                <p>Niemo</p>
            </header>
        </body>
    );
}

export default App;
