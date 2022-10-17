#!/bin/bash
aws cloudformation deploy \
    --region 'us-east-1' \
    --profile $DEPLOY_PROFILE
    --stack-name 'sddio-ui' \
    --template-file './codepipeline.yaml' \
    --capabilities CAPABILITY_IAM \
    --role-arn $ROLE
    --parameter-overrides \
    BuildspecPath=buildspec.yml \
    CodeBuildComputeType='BUILD_GENERAL1_SMALL' \
    CodeBuildImage='aws/codebuild/standard:5.0'  \
    CostCenter='100ACNF'  \
    CostCenterApprover='DA38554' \
    CreateECRRepo='false' \
    CreateGitHubRepoFromBlueprint='false'  \
    Custodian='TC88497' \
    DataClassification='Yellow' \
    Environment='QA' \
    GitHubOwner='EliLillyCo' \
    GitHubPAT=$GITHUB_PAT \
    GitHubSecret=$GITHUB_SECRET \
    Level1BusinessArea='MDIT' \
    ParameterFileName=$PARAMS_FILE \
    PostBackTestResults='true' \
    PostDeployBuildspecPath=post-deploy-buildspec.yml \
    PostDeployCodeBuildComputeType='BUILD_GENERAL1_SMALL' \
    PrimaryITContact='C230968' \
    ProjectName='sddio-ui' \
    RepositoryBranch=$BRANCH_NAME \
    RepositoryName='dhai_sddio_ui' \
    SystemOwner='DA38554' \
    TemplatePath=template.yml