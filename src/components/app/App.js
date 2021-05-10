import React, { Component } from "react";
import "./App.css";
import WebShots from "./webshots";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webshots: [],
    };
  }
  componentWillMount() {
    var webshots = [];
    webshots.push(<WebShots appContext={this} key={"webshots-screen"} />);
    this.setState({
      webshots: webshots,
    });
  }
  render() {
    return <div className="App">{this.state.webshots}</div>;
  }
}

export default App;
