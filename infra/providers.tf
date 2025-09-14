terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "mock"
  secret_key                  = "mock"
  skip_credentials_validation = true
  skip_requesting_account_id  = true

  endpoints {
    dynamodb  = var.aws_endpoint
    cloudwatch = var.aws_endpoint
    logs      = var.aws_endpoint
    iam       = var.aws_endpoint
    sts       = var.aws_endpoint
  }
}
