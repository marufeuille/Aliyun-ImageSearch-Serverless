provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"

}

data "external" "init" {
  program = ["bash", "./script/init.sh"]
}

resource "alicloud_oss_bucket" "ims-frontend" {
  bucket = "ims-frontend001"

  website = {
    index_document = "index.html"
    error_document = "error.html"
  }

  depends_on = ["data.external.init"]
}

data "external" "copy_to_oss" {
  program = ["bash", "./script/copy_to_oss.sh"]
  depends_on = ["alicloud_oss_bucket.ims-frontend"]
}
