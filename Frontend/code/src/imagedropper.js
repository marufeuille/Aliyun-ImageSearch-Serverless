import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CssBaseline from '@material-ui/core/CssBaseline';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import MediaQuery from 'react-responsive';

const styles = theme => ({
  root: {
    height: "300px",
    marginTop: "10px",
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
  },
  hidden: {
    display: "none"
  },
  dropperWrapper: {
    width: "80%",
    height: "200px",
    margin: "auto",
    top: 0,
    bottom: 0,
    borderRadius: "5px",
    position: "ansolute",
    lineHeight: "200px"
  },
  dropper: {
    display: "inline-block",
    width: "100%",
    height: "200px",
    margin: "auto",
    top: 0,
    bottom: 0,
    backgroundColor: "#fff",
    border: "1px dashed #ccc",
    borderRadius: "5px",
    verticalAlign: "middle",
    lineHeight: "200px",
    backgroundImage: "url('picture.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right",
    paddingLeft: "10px"
  },
  innerContents: {
  }
});

const cancelEvent = function(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
};

class ImageDropper extends React.Component {
  constructor(props) {
    super(props);
  }

  fileread = function (file) {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      this.props.updateState({file: file, base64img: reader.result.toString("base64"), activeStep: 1});
    });
    reader.readAsDataURL(file);
  };

  componentDidMount() {
    document.getElementById("fileselector").addEventListener("change", (ev) => {
      this.fileread(document.getElementById("fileselector").files[0]);
    });

    const droparea = document.getElementById("dropper");
    droparea.addEventListener("dragenter", cancelEvent);
    droparea.addEventListener("dragover", cancelEvent);

    droparea.addEventListener("drop", (ev) => {
      cancelEvent(ev);
      this.fileread(ev.dataTransfer.files[0]);
    });

  }

  render() {
    return (
      <Grid container justify="center" className={this.props.classes.root} wrap='wrap'>
        <CssBaseline />
        <Grid item xs={6} className={this.props.classes.dropperWrapper} wrap='wrap'>
          <label htmlFor="fileselector" id="dropper" className={this.props.classes.dropper}>
            <MediaQuery query="(min-width: 1200px)">
              <span className={this.props.classes.innerContents}>choose file or drag into here.</span>
            </MediaQuery>
          </label>
          <input type="file" name="fileselector" id="fileselector" className="hidden"/>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ImageDropper)
