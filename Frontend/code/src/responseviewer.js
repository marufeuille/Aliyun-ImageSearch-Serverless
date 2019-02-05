import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import ReplayIcon from '@material-ui/icons/Replay'
import { config } from "./config.js"
const picture_oss_url = config["picture_oss_url"];
const styles = theme => ({
  responseItem: {
    backgroundColor: "#fff"
  },
  button: {
    margin: theme.spacing.unit
  }
});

const catIdToName = (catId) => {
  return {
    0: "トップス",
    1: "ドレス",
    2: "ボトムズ",
    3: "バッグ",
    4: "シューズ",
    5: "アクセサリー",
    6: "スナック",
    7: "メイクアップ",
    8: "ボトルドリンク",
    9: "家具",
    20: "おもちゃ",
    21: "下着",
    22: "デジタル機器",
    88888888: "その他"
  }[catId];
}

class ResponseViewer extends React.Component {

  componentDidMount() {
    this.props.onRef(this);

    const { picinfo } = this.props.response.SearchItemResponse;
    const { base64img } = this.props;

    const canvas = document.getElementById("input-canvas");
    const img = new Image();
    img.addEventListener("load", (ev) => {
      let w = img.width,
          h = img.height;

      const region = picinfo["Region"].split(",");
      const x0 = Number(region[0]),
            x1 = Number(region[1]),
            y0 = Number(region[2]),
            y1 = Number(region[3]);
      canvas.width = w;
      canvas.height = h;

      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, w, h);
      context.strokeStyle = "rgb(200, 0, 0)";
      context.lineWidth = 10;
      context.strokeRect(x0, y0, Math.abs(x1-x0), Math.abs(y1-y0));

      if (w < h) {
        w = Math.ceil(w * (200/h));
        h = 200;
      }
      else {
        h = Math.ceil(h * (200/w));
        w = 200;
      }

      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

    });
    img.src = base64img;

  }

  processResponse = (response) => {
    console.log("response: " + JSON.stringify(response));
    console.log(response);
    this.setState({response: response})
  };
  render() {
    const { response } = this.props;
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item>
          <Grid container justify="center" spacing={16}>
            <Grid item xs={12}>
              <Button variant="extendedFab" aria-label="Delete" className={classes.button} onClick={this.props.handleReset}>
                <ReplayIcon />
                Retry
              </Button>
            </Grid>
            <Grid item xs={12}>
              <AppBar position="static" color="default">
                <Toolbar>
                  <Typography variant="title" color="inherit">
                    Input Image Analysis Result
                  </Typography>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item xs={4} className={classes.responseItem}>
                  <Grid container justify="center">
                    <Grid item>
                      <canvas id={"input-canvas"} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={8} className={classes.responseItem}>
                  <List>
                    <ListItem>
                      Category: {catIdToName(response.SearchItemResponse.picinfo.Category)}
                    </ListItem>
                    <ListItem>
                      Region: {
                        (() => {
                          const region = response.SearchItemResponse.picinfo.Region.split(",");
                          return "(" + region[0] + ", " + region[2] + ") -> (" + region[1] + ", " + region[3] +")";
                        })()
                      }
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

            </Grid>

            <Grid item xs={12}>
              <AppBar position="static" color="default">
                <Toolbar>
                  <Typography variant="title" color="inherit">
                    Image Search Returned Image
                  </Typography>
                </Toolbar>
              </AppBar>
            </Grid>

            {
              response.SearchItemResponse.auctions.map((item, index) => {
                const img = new Image();
                img.addEventListener("load", (ev) => {
                  let w = img.width,
                      h = img.height;
                  const canvas = document.getElementById("canvas" + index);
                  canvas.width = w;
                  canvas.height = h;

                  const context = canvas.getContext("2d");
                  context.drawImage(img, 0, 0, w, h);

                  if (w < h) {
                    w = Math.ceil(w * (200 / h));
                    h = 200;
                  }
                  else {
                    h = Math.ceil(h * (200 / w));
                    w = 200;
                  }

                  canvas.style.width = w + "px";
                  canvas.style.height = h + "px";
                });
                console.log(picture_oss_url + item.PicName)
                img.src = picture_oss_url + item.PicName;
                return (
                  <Grid item key={index} xs={12}>
                    <Grid container justify="center">
                      <Grid item xs={12} className={classes.responseItem}>
                        <Grid container justify="center">
                          <Grid item>
                            <canvas id={"canvas" + index} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} className={classes.responseItem}>
                        <Grid container spacing={8}>
                          <Grid item xs={4}>PicName</Grid><Grid item xs={8}>{item["PicName"]}</Grid>
                          <Grid item xs={4}>ItemId</Grid><Grid item xs={8}>{item["ItemId"]}</Grid>
                          <Grid item xs={4}>CatId</Grid><Grid item xs={8}>{item["CatId"]} ({catIdToName(item["CatId"])})</Grid>
                          <Grid item xs={4}>SortExprValues</Grid><Grid item xs={8}>{item["SortExprValues"]}</Grid>
                          <Grid item xs={4}>CustContent</Grid><Grid item xs={8}>{item["CustContent"]}</Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })
            }
            <Grid item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ResponseViewer)
