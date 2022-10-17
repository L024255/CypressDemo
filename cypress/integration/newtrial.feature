Feature: Create New Trial

    Scenario: Click on Create New
        Given I am on Homepage
        When I click on Create New
        Then location includes "http://localhost:3000/create-new"

    Scenario: Click on New Trial Workspace
        Given I am on Create New Page
        When I click on 'New Trial Workspace'
        Then location includes 'http://localhost:3000/new-trial-detail/workspace'

    Scenario: Creating New Trial
        Given I am on Create Trial Workspace
        When I enter Trial Title
        When I enter Trial Notes
        When I select the Therapeutic area as 'Endocrinology'
        When I select the indication as 'Type 2 Diabetes'
        When I enter the molecule
        When I enter the duration as '12'
        When I enter the trial alias as 'TST-EC-DEMO'
        And I click on 'Create Trial Workspace'
        Then Trial should be successfully created and redirected to Trial Homepage




