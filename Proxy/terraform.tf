provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}

data "external" "init" {
  program = ["bash", "./script/init.sh"]
}

data "archive_file" "function" {
  type = "zip"
  output_path = "./ims.zip"
  source_dir = "./code"
}

resource "alicloud_fc_service" "imagesearch-proxy-service" {
  name = "imagesearch-proxy"
  description = "created by tf"
  internet_access = false
  depends_on = ["data.external.init"]
}

resource "alicloud_fc_function" "imagesearch-proxy-function" {
  service = "${alicloud_fc_service.imagesearch-proxy-service.name}"
  name = "imagesearch-proxy-function"
  description = "created by tf"
  filename = "${data.archive_file.function.output_path}"
  memory_size = "128"
  runtime = "nodejs8"
  handler = "index.handler"
}

resource "alicloud_fc_trigger" "imagesearch-proxy-http-trigger" {
  service = "${alicloud_fc_service.imagesearch-proxy-service.name}"
  function = "${alicloud_fc_function.imagesearch-proxy-function.name}"
  name = "imagesearch-proxy-http-trigger"
  type = "http"
  config = "${file("trigger/http.yml")}"
}
