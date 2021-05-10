import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import axios from "axios";
var apiBaseUrl = "http://100.26.247.22:3001/capture";

class Webshots extends Component {
  constructor(props) {
    super(props);
    var webshotsComponent = [];
    webshotsComponent.push(
      <MuiThemeProvider key={"theme"}>
        <div class="ws-padding">
          <TextField
            hintText="Enter the remote url"
            floatingLabelText="Enter remote url"
            onChange={(event, newValue) =>
              this.setState({ remoteUrl: newValue })
            }
          />
          <br />
          Screen Size
          <br />
          <TextField
            hintText="Widthl"
            type="number"
            floatingLabelText="Width"
            onChange={(event, newValue) =>
              this.setState({ screenWidth: newValue })
            }
          />
          <TextField
            hintText="Height"
            type="number"
            floatingLabelText="Height"
            onChange={(event, newValue) =>
              this.setState({ screenHeight: newValue })
            }
          />
          <br />
          Shot Size
          <br />
          <TextField
            hintText="Width"
            type="number"
            floatingLabelText="Width"
            onChange={(event, newValue) =>
              this.setState({ shotWidth: newValue })
            }
          />
          <TextField
            hintText="Height"
            floatingLabelText="Height"
            onChange={(event, newValue) =>
              this.setState({ shotHeight: newValue })
            }
          />
          <br />
        </div>
      </MuiThemeProvider>
    );
    this.state = {
      remoteUrl: "",
      screenWidth: "",
      screenHeight: "",
      shotWidth: "",
      shotHeight: "",
      format: "PNG",
      webshotsComponent: webshotsComponent,
    };
  }

  getName(url, format) {
    let domain = new URL(url);
    domain = domain.hostname;
    console.log(domain);

    domain = domain.replace("www.", "");
    domain = domain.replace(".", "");
    console.log(domain);
    return `${domain}.${format.toLowerCase()}`;
  }
  urlValidator(url) {
    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regex = new RegExp(expression);
    return url.match(regex);
  }

  handleClick(event) {
    if (!this.urlValidator(this.state.remoteUrl.trim())) {
      alert(`${this.state.remoteUrl} Not a valid url`);
      console.log("enter valid url");
      return;
    }
    var payload = {
      remoteUrl: this.state.remoteUrl,
      imageName: this.getName(this.state.remoteUrl, this.state.format),
      shotSize: { width: this.state.shotWidth, height: this.state.shotHeight },
      format: this.state.format,
      screenSize: {
        width: this.state.screenWidth,
        height: this.state.screenWidth,
      },
    };
    console.log("payload", payload);
    axios
      .post(apiBaseUrl, payload, {
        responseType: "blob",
      })
      .then((response) => {
        console.log("HEre");
        let fileName = response.headers["content-type"].split("fileName=")[1];
        let contentType = response.headers["content-type"]
          .split("type=")[1]
          .split(",")[0];

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: contentType,
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <AppBar title="Capture web screen shots" />
        </MuiThemeProvider>
        {this.state.webshotsComponent}

        <MuiThemeProvider>
          <div class="ws-padding">
            <p>Format:</p>
            <DropDownMenu
              value={this.state.format}
              onChange={(event, index, value) =>
                this.setState({
                  format: value,
                })
              }
            >
              <MenuItem value={"PNG"} primaryText="PNG" />
              <MenuItem value={"JPG"} primaryText="JPG" />
              <MenuItem value={"PDF"} primaryText="PDF" />
            </DropDownMenu>
            <br></br>
            <RaisedButton
              label="Submit"
              primary={true}
              style={style}
              onClick={(event) => this.handleClick(event)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
  margin: 15,
};

export default Webshots;
