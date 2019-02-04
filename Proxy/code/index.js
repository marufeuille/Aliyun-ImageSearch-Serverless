const Client = require("@alicloud/imagesearch-2018-01-20");
const path = require("path");
const Multipart = require("./Multipart");
const getRawBody = require("raw-body");
const config = require("config");

/* convert buffer to string */
const _buffer_to_string = (buf) => {
    return String.fromCharCode.apply("", new Uint8Array(buf));
};

/* slice buffer and convert to string */
const buffer_to_string = (buf) => {
  const tmp = [];
  const len = 1024;
  for (let p = 0; p < buf.byteLength; p += len) {
    tmp.push(_buffer_to_string(buf.slice(p, p + len)));
  }
  return tmp.join("");
}

module.exports.handler = (request, response, context) => {
  /* Setting Client */
  const creds = context.credentials;
  const client = new Client({
            accessKeyId: creds['accessKeyId'],
            accessKeySecret: creds['accessKeySecret'],
            endpoint: process.env['endpoint'],
            securityToken: creds["securityToken"],
            apiVersion: config.apiVersion

  });
  const instanceName = process.env['instanceName'];
  /* Parse Request Body */
  getRawBody(request)
    .then ((data) => {
      let picContent = "";
      let catId = "",
          num = 10,
          start = 0,
          crop = "",
          region = "";

      /* If Body Data is Empty */
      if (data.length == 0) {
        console.log("Request Body is Empty!!");
        response.setStatusCode(500);
        response.send(JSON.stringify({
          SearchItemResponse: {
            success: false,
            message: "Empty Request Body",
            code: 500,
            auctions: [],
            head: [],
            picinfo: []
          }
        }));
      }
      /* Parse Request Body Contents */
      else {
        console.log("Parse Request Body is starting...");
        const form = Multipart.parse(data, request["headers"]["content-type"]);
        console.log("Recieved File size is " + form["file"].byteLength + "bytes");
        picContent = buffer_to_string(form["file"]).replace("data:image/jpeg;base64,","");
        if (form["catId"]) {
          catId = buffer_to_string(form["catId"]);
          console.log("Recieved File's Category ID is " + catId || "Not Set.");
        }
        if (form["n"]) {
          num = Number(buffer_to_string(form["n"]));
        }
        if (form["s"]) {
          start = Number(buffer_to_string(form["s"]));
        }
        if (form["crop"]) {
          crop = buffer_to_string(form["crop"]);
        }
        if (form["region"]) {
          region = buffer_to_string(form["region"]);
        }
      }

      const buildSearchContent = () => {
        console.log("buildSearchContent Function is Starting...");
        let params = {};
        params.s = start + "";
        params.n = num + "";
        if (!!catId) {
          params.cat_id = catId + "";
        }
        if (!!crop) {
          params.crop = crop + "";
        }
        if (!!region) {
          params.region = region + "";
        }
        const picName = new Buffer("searchPic").toString("base64");
        params.pic_list = picName;
        params[picName] = picContent;
        return buildContent(params);
      }

      const buildContent = (params) => {
        console.log("buildContent Function is Starting...");
        let meta = "";
        let body = "";
        let start = 0;
        Object.keys(params).forEach((key) => {
          if (meta.length > 0) {
            meta += "#";
          }
          meta += key +"," + start + "," + (start + params[key].toString().length);
          body += params[key];
          start += params[key].toString().length;
        });
        console.log(meta + "^" + body);
        return meta + "^" + body;
      }

      /* Call ImageSearch */
      client.searchItem({
        instanceName: instanceName,
      }, buildSearchContent()).then((value) => {
        console.log("ImageSearch Instance returns: " +  JSON.stringify(value));
        response.setHeader("Content-Type", "application/json");
        response.send(JSON.stringify({
          SearchItemResponse: {
            success: value["Success"],
            requestId: value["RequestId"],
            message: value["Message"],
            code: value["Code"],
            auctions: value["Auctions"]["Auction"],
            head: value["Head"],
            picinfo: value["PicInfo"]
          }
        }));
      }).catch((err) => {
        console.log("Error Message: ", err);
        response.setHeader("Content-Type", "application/json");
        response.send(JSON.stringify({
          SearchItemResponse: {
            success: value["Success"],
            requestId: value["RequestId"],
            message: value["Message"],
            code: value["Code"],
            auctions: value["Auctions"]["Auction"],
            head: value["Head"],
            picinfo: value["PicInfo"]
          }
        }));
      });
    });
}

