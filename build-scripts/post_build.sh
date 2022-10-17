#!/bin/sh

# This runs the post_build phase of the build.

sync_to_s3() {
  STACK_NAME="dhai-sddio-ui-deployment"
  export S3_BUCKET=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query "Stacks[*].Outputs[?OutputKey=='WebBucket'].OutputValue" --output text)
  bucket_path="s3://${S3_BUCKET}"
  list_of_synced_files="files_synced.txt"
  aws s3 sync build ${bucket_path} --delete --sse AES256 > ${list_of_synced_files}
}

invalidate_cloudfront() {
  STACK_NAME="dhai-sddio-common-deployment"
  export CLOUD_FRONT_ID=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query "Stacks[*].Outputs[?OutputKey=='CloudFrontId'].OutputValue" --output text)
  while read file; do file_list="$file_list ${file##*$bucket_path}"; done < ${list_of_synced_files}
  aws cloudfront create-invalidation --distribution-id ${CLOUD_FRONT_ID} --paths "/*"
}

echo "Starting post_build - $(date)"
set -xe
sync_to_s3
invalidate_cloudfront
echo "Completed post_build - $(date)"