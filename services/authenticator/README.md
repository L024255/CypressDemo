# Cirrus AWS Authenticators

> Lambda Authenticators for API Gateway and CloudFront, built by Cirrus

## Install

The Lambda functions can be deployed from your local machine if you have the [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli)
installed and if you have AWS CLI access configured to the AWS account.

Either install the dependencies for the functions by hand, or run `sam build`. If deploying the `edgeAuth` function you must install dependencies with the `--only=prod` flag.
The code needs the `aws-sdk` for unit tests, but does not need that included for production. Since the function is meant to be used as a Lambda@Edge function it has stricter
size limitations. You can use the `sam package` and `sam deploy` commands to package and deploy the functions.

## Usage

If you have the [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli) and Docker installed you can execute the Lambda
functions locally for testing purposes.

You can run the command below to see details on how to invoke a function locally.

```bash
sam local invoke --help
```

The functions are deployed and available for use as a AWS CloudFormation Nested Stack or as a AWS SAM Application.
Sandbox and Landing Zone accounts both have access, though they must use different URLs.

| AWS Account Type | Base URL                                                                                |
|------------------|-----------------------------------------------------------------------------------------|
| Landing Zone     | `https://lly-templates.s3.amazonaws.com/cirrus/cloudformation/cirr-aws-authenticators/` |
| Sandbox          | `https://cirr-aws-authenticators.s3.amazonaws.com/cloudformation/`                      |

The templates are deployed multiple times in an effort to have a setup similar to different environments. Below is a table explaining the different template file names.

| Template File Name | Environment | Notes                                                            |
|--------------------|-------------|------------------------------------------------------------------|
| `dev.yaml`         | Development | Development code, corresponds to the master branch               |
| `qa.yaml`          | QA          | QA code, corresponds to the latest Pre-Release GitHub Release    |
| `prod.yaml`        | Production  | The most recently created GitHub Release                         |
| `latest.yaml`      | Production  | The most recently created GitHub Release                         |
| `v*.*.*.yaml`      | Production  | Specific GitHub Release versions                                 |

It is recommended to use the versioned files, to avoid things accidentally breaking. Examples are below.

*CloudFormation Template Resource*
```yaml
# ...
CirrusAuthenticators:
  Type: AWS::CloudFormation::Stack
  Properties:
    Parameters:
      ApiAuthExpectedAudience: example-aud
      EdgeAuthCloudFrontDistributionId: ABCDEFGH
      CostCenter: ...
      CostCenterApprover: ...
      SystemOwner: ...
      SystemCustodian: ...
      PrimaryItContact: ...
      Level1BusinessArea: ...
      DataClassification: ...
      Hipaa: ...
    TemplateURL: https://lly-templates.s3.amazonaws.com/cirrus/cloudformation/cirr-aws-authenticators/v4.0.0.yaml
# ...
```

*SAM Template Resource*
```yaml
# ...
CirrusAuthenticators:
  Type: AWS::Serverless::Application
  Properties:
    Parameters:
      ApiAuthExpectedAudience: example-aud
      EdgeAuthCloudFrontDistributionId: ABCDEFGH
      CostCenter: ...
      CostCenterApprover: ...
      SystemOwner: ...
      SystemCustodian: ...
      PrimaryItContact: ...
      Level1BusinessArea: ...
      DataClassification: ...
      Hipaa: ...
    Location: https://lly-templates.s3.amazonaws.com/cirrus/cloudformation/cirr-aws-authenticators/v4.0.0.yaml
# ...
```

In either of the cases above you could use `!Ref CirrusAuthenticators.Outputs.EdgeAuthFunctionVersion` in a YAML file to reference the current
edgeAuth Function Version ARN. You could use `!Ref CirrusAuthenticators.Outputs.ApiAuthFunctionAlias` to reference the latest version of the
apiAuth Function.

### Cloudformation API Gateway Template
The following template can be used to attach the authorizer to an AWS API Gateway method. 

Stubs for the AWS resources have been provided, but only the required fields for the authorizer have been completed.

*In order to attach the Authorizer, you must define an AWS::ApiGateway::Authorizer resource to reference within the AWS::ApiGateway::Method, and an AWS::Lambda::Permission resource to allow permission for the API Gateway to invoke the Lambda Authorizer function*

**Cloudformation Template Resource**
```yaml
# ...     
CirrusAuthenticators:
  Type: AWS::CloudFormation::Stack
  Properties:
    Parameters:
      ApiAuthExpectedAudience: example-aud
      EdgeAuthCloudFrontDistributionId: ABCDEFGH
      CostCenter: ...
      CostCenterApprover: ...
      SystemOwner: ...
      SystemCustodian: ...
      PrimaryItContact: ...
      Level1BusinessArea: ...
      DataClassification: ...
      Hipaa: ...
    TemplateURL: https://s3.amazonaws.com/lly-templates/cirrus/cloudformation/cirr-aws-authenticators/v2.0.1.yaml

Authorizer:
  Type: 'AWS::ApiGateway::Authorizer'
  DependsOn:
    - CirrusAuthenticators #Ensure Authenticator CFN template is created before referencing
  Properties:
    AuthType: String
    AuthorizerCredentials: String
    AuthorizerResultTtlInSeconds: '0'
    AuthorizerUri: !Join
      - ''
      - - 'arn:aws:apigateway:'
        - !Ref 'AWS::Region'
        - ':lambda:path/2015-03-31/functions/'
        - !GetAtt CirrusAuthenticators.Outputs.ApiAuthFunctionArn
        - /invocations
    IdentitySource: method.request.header.Authorization #Use Authorization Header for Lambda Authorizer
    IdentityValidationExpression: String
    Name: String
    ProviderARNs: 
      - String
    RestApiId: String
    Type: REQUEST #Required for Lambda Authorizer

ApiGatewayInvokeAuthorizerLambda:
  Type: AWS::Lambda::Permission
  Properties: 
    Action: "lambda:InvokeFunction"
    EventSourceToken: String
    FunctionName: !GetAtt CirrusAuthenticators.Outputs.ApiAuthFunctionArn #Refer to Authorizer Function ARN
    Principal: "apigateway.amazonaws.com"
    SourceAccount: String
    SourceArn: !Join
      - ''
      - - !Sub "arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:"
        - !Ref [REFERENCE BASE REST HERE]
        - "/authorizers/*" #Grant API Permission

APIMethod:
  Type: AWS::ApiGateway::Method
  DependsOn:
    - Authorizer #Ensure Authorizer is created before referencing
  Properties: 
    ApiKeyRequired: Boolean
    AuthorizationScopes: 
      - String
    AuthorizationType: CUSTOM #Required for Lambda Authorizer
    AuthorizerId: !Ref Authorizer #Reference the lambda authorizer
    HttpMethod: String
    Integration: 
      Integration
    MethodResponses: 
      - MethodResponse
    OperationName: String
    RequestModels: 
      Key : Value
    RequestParameters: 
      Key : Value
    RequestValidatorId: String
    ResourceId: String
    RestApiId: String
# ...
```

### CloudFormation Parameters

| Parameter                          | Required | Description
|------------------------------------|:--------:|------------
| `LogLevel`                         |     N    | Sets the logging level for the Lambda functions. Accepted values: `DEBUG`, `INFO`, `WARN`, `ERROR`, `NONE`. Defaults to `WARN`
| `ApiAuthExpectedAudience`          |     N    | Assigns the value of the `AUDIENCE` lambda environment variable (lambda authorizer) or the `expected-audience` SSM parameter (lambda edge) <sup>1</sup> <sup>2</sup>
| `ApiAuthExpectedIssuer`            |     N    | Assigns the value of the `ISSUER` lambda environment variable (lambda authorizer) <sup>1</sup>
| `ApiAuthExpectedClientId`          |     N    | Assigns the value of the `CLIENTID` lambda environment variable (lambda authorizer) <sup>1</sup>
| `EdgeAuthCloudFrontDistributionId` |     N    | CloudFront Distribution ID the edge authenticator is configured for. This is used to configure SSM Parameter Store access for the Lambda <sup>2</sup>
| `PermissionsBoundary`              |     N    | Enables/disables the use of the AWS Landing Zone account Permissions Boundaries. Accepted values: `TRUE`, `FALSE`. Defaults to `FALSE`
| `CostCenter`                       |     Y    | Cost Center ID, for example "100A870"
| `CostCenterApprover`               |     Y    | Global ID for the Cost Center approver, for example "2054868"
| `SystemOwner`                      |     Y    | Global ID for the system owner, for example "2054868"
| `SystemCustodian`                  |     Y    | Global ID for the system custodian, for example "2054868"
| `PrimaryItContact`                 |     Y    | Global ID for the primary IT contact, for example "2054868"
| `Level1BusinessArea`               |     Y    | Level 1 business area name, for example "Global Services"
| `DataClassification`               |     Y    | Data classification level. Accepted values: `Green`, `Yellow`, `Orange`, `Red`, `TBD`
| `Hipaa`                            |     Y    | Whether this application must maintain HIPAA compliance. Accepted values: `Yes`, `No`, `TBD`

1. See the [Lambda Authorizer README](functions/apiAuth/README.md#environment-variables) for more details.
2. See the [Lambda Edge README](functions/edgeAuth/README.md#aws-systems-manager-parameter-store-values) for more details.

### `apiAuth` Function

[see the function's README for details](functions/apiAuth/README.md)

### `edgeAuth` Function

[see the function's README for details](functions/edgeAuth/README.md)

## Deployment Process

Jenkins automatically deploys the Lambda functions and template files based on certain triggers.


| Template File | Trigger                               |
|---------------|---------------------------------------|
| `dev.yaml`    | Pull Request to master branch created |
| `qa.yaml`     | Commit made to master branch          |
| `latest.yaml` | GitHub Release created                |
| `prod.yaml`   | GitHub Release created                |
| `v*.*.*.yaml` | GitHub Release created                |


## Contributing

1. Clone this repository:
```zsh
git clone https://github.com/EliLillyCo/cirr-aws-authenticators.git
```

2. Create a new branch with a descriptive name matching the issue:

```zsh
git checkout develop
git checkout -b feature/123-issue-description-here
```

3. If this is a change in functionality, add a unit test that fails without that new functionality.

4. Make necessary code changes.

5. Run linting scripts for each function:
```zsh
cd ./functions/apiAuth
npm run lint
cd ../edgeAuth
npm run lint
```

6. Run unit tests. Make sure that your new test is passing:
```zsh
cd ./functions/apiAuth
npm run test
cd ../edgeAuth
npm run test
```

7. Update the `CHANGELOG.md` file with your changes. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) so keep that in mind when assigning your version number.

8. Push your branch to GitHub and open a pull request.

9. Wait for continuous integration tests to pass (will appear as a comment in the pull request).

10. Wait for feedback. You will need two approving reviews before your code is allowed to be merged with the master branch.
