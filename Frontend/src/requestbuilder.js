import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListIcon from '@material-ui/icons/List';
import Select from '@material-ui/core/Select';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import ImageIcon from '@material-ui/icons/Image';
import { withStyles } from '@material-ui/core/styles';

import loadImage from 'blueimp-load-image';

import { config } from "./config.js";

const styles = theme => ({
  root: {
  },
  button: {
    margin: theme.spacing.unit,
  },
  item: {
    backgroundColor: "#fff",
    padding: 0
  },
  region: {
    width: "60px"
  }
});

class RequestBuilder extends React.Component {

  state = {
    category: 88888888,
    base64img: "",
    file: "",
    converted_base64img: "",
    original_width: 0,
    original_height: 0
  }

  componentDidMount() {
    this.props.onRef(this)
 //   const base64img = this.props.base64img;
    const file = this.props.file;
    //this.setState({base64img: base64img});
    const orig_canvas = document.createElement("canvas");
    const req_canvas = document.createElement("canvas");
    const orig_context = orig_canvas.getContext("2d");
    const req_context = req_canvas.getContext("2d");

    // set default value
    this.setState({category: 88888888});

    const base64ToBlob = (base64) => {
      var base64Data = base64.split(',')[1], // Data URLからBase64のデータ部分のみを取得
          data = window.atob(base64Data), // base64形式の文字列をデコード
          buff = new ArrayBuffer(data.length),
          arr = new Uint8Array(buff),
          blob,
          i,
          dataLen;
      // blobの生成
      for (i = 0, dataLen = data.length; i < dataLen; i++) {
        arr[i] = data.charCodeAt(i);
      }
      blob = new Blob([arr], {type: 'image/jpeg'});
      return blob;
    }


    const outer = this;
    loadImage(file, (img) => {
      console.log(file)
      console.log(img)
      let w = img.width,
          h = img.height;

      this.setState({
        original_width: w,
        original_height: h
      });

      orig_canvas.width = w;
      orig_canvas.height = h;
      orig_context.drawImage(img, 0, 0, w, h);
      if (1024 < w || 1024 < h) {
        if (h < w) {
          h = Math.ceil(h * (1024/w));
          w = 1024;
        }
        else if (w < h) {
          w = Math.ceil(w * (1024/h));
          h = 1024;
        }
      }

      if (w < 200 || h < 200) {
        if (w < h) {
          h = Math.ceil(h * (200/w));
          w = 200;
        }
        else if (h < w) {
          w = Math.ceil(w * (200/h));
          h = 200;
        }
      }
      this.setState({
        width: w,
        height: h
      });

      req_canvas.width = w;
      req_canvas.height = h;
      req_context.drawImage(img, 0, 0, w, h);
      let style_w = "",
          style_h = "";
      if (w < h) {
        const scale = 200 / h;
        style_w = w * scale + "px";
        style_h = "200px";
      }
      else {
        const scale = 200 / w;
        style_w = "200px";
        style_h = h * scale + "px";
      }
      orig_canvas.style.width = style_w;
      orig_canvas.style.height = style_h;
      req_canvas.style.width = style_w;
      req_canvas.style.height = style_h;
      
      const original_base64 = req_canvas.toDataURL("image/jpeg");
      const original_blob = base64ToBlob(original_base64);
      console.log("upload file size is " + original_blob["size"]);
      if(2000000 <= original_blob["size"]) {
        console.log("file size is more than 2,000,000Byte!!")
        const ratio = 2000000 / original_blob["size"]

        console.log("compression ratio is " + ratio);
        this.setState({converted_base64img:  req_canvas.toDataURL("image/jpeg", ratio)});
      }
      else {
        this.setState({converted_base64img:  req_canvas.toDataURL("image/jpeg")});
      }
      document.getElementById("original-img").appendChild(orig_canvas);
      document.getElementById("request-img").appendChild(req_canvas);
    },{orientation: true});
  };

  handleState = (ev) => {
    this.setState({category: ev.target.value});
  };

  searchImage = (ev) => {
    console.log(config);
    const imagesearch_proxy_url = config["imagesearch_proxy_url"];
    console.log("orig img size: " + this.state.base64img.length);
    console.log("conv img size: " + this.state["converted_base64img"].length);
    const select = document.getElementById("category");
    const selectedIndex = select.selectedIndex;
    const cat = select.options[selectedIndex].value;
    console.log("category: " + cat);

    const form = new FormData();
    form.append("file", this.state["converted_base64img"]);
    if (cat != -1) {
      form.append('catId', cat)
    }

    const number = document.getElementById("number").value;
    if (number != "" && number > 0) {
      form.append("n", number);
    }

    const startIndex = document.getElementById("start").value;
    if (startIndex != "" && number > 0) {
      form.append("s", startIndex);
    }

    const crop_selection = document.getElementById("crop");
    const idx = crop_selection.selectedIndex;
    const crop_enable = crop_selection.options[idx].value;
    console.log("crop : " + crop_enable);
    form.append("crop", crop_enable);

    const x1 = document.getElementById("region-x1").value,
          x2 = document.getElementById("region-x2").value,
          y1 = document.getElementById("region-y1").value,
          y2 = document.getElementById("region-y2").value;

    if (x1 != "" && x2 != "" && y1 != "" && y2 != "" &&
        x1 >= 0 && x2 >= 0 && y1 >= 0 && y2 >= 0) {
      form.append("region", x1 + "," + x2 + "," + y1 + "," + y2);
    }

    const request = new XMLHttpRequest();
    request.addEventListener("load", (ev) => {
      console.log(request.response);
      this.setState({
        response: request.response
      });
      this.props.updateState(this.state);
    });
    request.open("POST", imagesearch_proxy_url);
    request.responseType = "json"
    request.send(form);
  };

  render() {
    const { classes } = this.props;

    return (
    <Grid container id="request-builder" className={classes.root}>
      <Grid item xs={12}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Grid container justify="center" className={classes.item} spacing={16}>
              <Grid item xs={12}>
                <AppBar position="static" color="default">
                  <Toolbar>
                    <Typography variant="title" color="inherit">Original Image Info</Typography>
                  </Toolbar>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="left">
                  <Grid item id="original-img"></Grid>
                </Grid>
              </Grid>
              <Grid item id="original-params" xs={12}>
                <Grid container spacing={16}>
                  <Grid item xs={1}>
                    <ImageIcon />
                  </Grid>
                  <Grid item xs={11}>
                    <Grid container spacing={16}>
                      <Grid item xs={12}>
                        width {this.state["original_width"]}px
                      </Grid>
                      <Grid item xs={12}>
                        height {this.state["original_height"]}px
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="left" className={classes.item} spacing={16}>
              <Grid item xs={12}>
                <AppBar position="static" color="default">
                  <Toolbar>
                    <Typography variant="title" color="inherit">Request Param</Typography>
                  </Toolbar>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="left">
                  <Grid item id="request-img"></Grid>
                </Grid>
              </Grid>
              <Grid item id="request-params" xs={12}>
                <Grid container spacing={16}>
                  <Grid item xs={1}>
                    <ImageIcon />
                  </Grid>
                  <Grid item xs={11}>
                    <Grid container spacing={16}>
                      <Grid item xs={12}>
                        width {this.state["width"]}px
                      </Grid>
                      <Grid item xs={12}>
                        height {this.state["height"]}px
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <ListIcon />
                  </Grid>
                  <Grid item xs={10}>
                    <NativeSelect value={this.state.category} onChange={this.handleState} id="category">
                      <option value="-1">カテゴリなし</option>
                      <option value="0">トップス</option>
                      <option value="1">ドレス</option>
                      <option value="2">ボトムズ</option>
                      <option value="3">バッグ</option>
                      <option value="4">シューズ</option>
                      <option value="5">アクセサリー</option>
                      <option value="6">スナック</option>
                      <option value="7">メイクアップ</option>
                      <option value="8">ボトルドリンク</option>
                      <option value="9">家具</option>
                      <option value="20">おもちゃ</option>
                      <option value="21">下着</option>
                      <option value="22">デジタル機器</option>
                      <option value="88888888">その他</option>
                    </NativeSelect>
                  </Grid>
                  <Grid item xs={2}>
                    n
                  </Grid>
                  <Grid item xs={10}>
                    <TextField id="number" type="number" label="number of results" defaultValue="10"/>
                  </Grid>
                  <Grid item xs={2}>
                    s
                  </Grid>
                  <Grid item xs={10}>
                    <TextField id="start" type="number" label="start index" defaultValue="0"/>
                  </Grid>
                  <Grid item xs={2}>
                    crop
                  </Grid>
                  <Grid item xs={10}>
                    <NativeSelect id="crop">
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </NativeSelect>
                  </Grid>
                  <Grid item xs={2}>
                    region
                  </Grid>
                  <Grid item xs={10}>
                  (
                    <TextField id="region-x1" type="number" label="x1" className={classes.region}/>,
                    <TextField id="region-y1" type="number" label="y1" className={classes.region}/>) => 
                    (<TextField id="region-x2" type="number" label="x2" className={classes.region}/>,
                    <TextField id="region-y2" type="number" label="y2" className={classes.region}/>)
                  </Grid>
                </Grid>
              </Grid>
              <Grid item id="control" xs={12}>
                <Button variant="extendedFab" aria-label="Delete" className={classes.button} onClick={this.props.handleBack}>
                  <BackIcon />
                  Back
                </Button>
                <Button variant="extendedFab" aria-label="Delete" className={classes.button} onClick={this.searchImage}>
                  <ImageSearchIcon />
                  Search Image
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>);
  }
}

export default withStyles(styles)(RequestBuilder)
