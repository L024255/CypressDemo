Feature: Search Bar
  
  Scenario: Search using Search bar
    Given I am on Homepage
    When I search 'Endocrinology' via search bar on My Trials
    Then It should return 'Search Result'