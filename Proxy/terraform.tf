provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"

}

resource "alicloud_fc_service" "imagesearch-proxy-service" {
    name = "imagesearch-proxy"
    description = "created by tf"
    internet_access = false
}

resource "alicloud_fc_function" "imagesearch-proxy-function" {
  service = "${alicloud_fc_service.imagesearch-proxy-service.name}"
  name = "imagesearch-proxy-function"
  description = "created by tf"
  filename = "ims.zip"
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
