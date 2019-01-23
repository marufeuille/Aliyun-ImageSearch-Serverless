import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MyStepper from "./step"

/*
class Input extends React.Component {

  fileopen = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      const picBase64 = reader.result.toString("base64");
      const canvas = document.getElementById("input_file_canvas");
      const context = canvas.getContext("2d");
      const img = new Image();
      img.addEventListener("load", (ev) => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.style.width ="200px";
        document.getElementById("fileinput").classList.add("hidden");
        document.getElementById("fileshow").classList.remove("hidden");
      });
      img.src = picBase64;
    });
    reader.readAsDataURL(file)
  }

  filedrop = (ev) => {
    console.log("droped!!");
    ev.preventDefault();
    ev.stopPropagation();
    ev.target.classList.remove("dragover");
    const file = ev.dataTransfer.files[0];
    this.fileopen(file);
    return false;
  }

  dragover = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.target.classList.add("dragover");
  };

  dragleave = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.target.classList.remove("dragover");
  };

  fileSelected = (ev) => {
    const file = document.getElementById("file_input").files[0];
    this.fileopen(file);
  }

  componentDidMount() {
    const drop_area = document.getElementById("input_label")
    drop_area.addEventListener("drop", this.filedrop);
    drop_area.addEventListener("dragover", this.dragover);
    drop_area.addEventListener("dragleave", this.dragleave)

  }
  render () {
    return (
      <div className="input">
        <div id="fileinput">
          <label htmlFor="file_input" id="input_label" >ファイルを選択</label>
          <input type="file" id="file_input" name="file_input"></input>
        </div>
        <div id="fileshow" className="hidden">
          <h3>Search Parameter</h3>
          <div className="container">
            <div className="img float">
              <canvas id="input_file_canvas" />
            </div>
            <div className="parameters float">
              <label htmlFor="category">Category: </label>
              <select name="category" id="category"/>
            </div>
          </div>
          <div className="container">
            <input type="button" id="submit" value="call imagesearch"></input>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Input />,
  document.getElementById('root')
);
*/

class App extends React.Component {
  render() {
    return (
      <Grid container justify="center" spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <AppBar position="static" color="default">
                <Toolbar>
                  <Typography variant="title" color="inherit">
                    ImageSearch Demo App
                  </Typography>
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <MyStepper />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
