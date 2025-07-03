target "worker" {
  context = "."
  dockerfile = "./packages/sushii-worker/Dockerfile"
  tags = ["sushii-worker:local"]
}