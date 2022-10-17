
Feature: Login

    Scenario Outline: Login to SDDIO Web application

        Given User is at the login page
        When User is successfully logged in
        Then User is redirected to Homepage
        Then It should see the users initial on top

        Examples:
            | username | password |
            | Admin    | admin123 |