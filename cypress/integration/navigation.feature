Feature: Navigation
  
  Scenario: Click on My Trials
    Given I am on Homepage
    When I click on My Trials
    Then location includes "http://localhost:3000/"

  Scenario: Click on All Trials
    Given I am on Homepage
    When I click on All Trials
    Then location includes "http://localhost:3000/all-trials"

  Scenario: Click on Create New
    Given I am on Homepage
    When I click on Create New
    Then location includes "http://localhost:3000/create-new"

  