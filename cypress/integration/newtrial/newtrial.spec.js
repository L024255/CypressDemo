/* eslint-disable no-undef */
/// <reference types="cypress" />
import { And, Given, Then, When } from "cypress-cucumber-preprocessor/steps";

const baseUrl = Cypress.env("baseUrl");
const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIyOWNkMzFlNS0wYWM1LTQ0MWMtYjQzNS03ZWEwYzg3MDlkZGUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMThhNTlhODEtZWVhOC00YzMwLTk0OGEtZDg4MjRjZGMyNTgwL3YyLjAiLCJpYXQiOjE2NTIxNjIxNjQsIm5iZiI6MTY1MjE2MjE2NCwiZXhwIjoxNjUyMTY2NDE4LCJhaW8iOiJBVVFBdS84VEFBQUFZM2lnNFRzcFFKeEcrejE2Mm1uVEI0RjVPcEx2MzdubEVXOTEvcE1CcnlYTkxRaTZ1TG5CdWdxTDZzclB4R1Q1Vk5xUUl4MHN5MDllVTVHdmR6TWhKUT09IiwiYXpwIjoiNTQ0ZWY2MTYtNzgyOS00YWY2LTliZDgtNjAzY2ViODE0YjAxIiwiYXpwYWNyIjoiMSIsIm5hbWUiOiJCZWxsYXJlIFNoYWxpbmkgUGFpIiwib2lkIjoiYTZmMjU3NzEtZGVkZC00ODU5LTg1ZDQtMWY4MDA2ZjA2MzhkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicGFpX3NoYWxpbmlAbGlsbHkuY29tIiwicmgiOiIwLkFSZ0FnWnFsR0tqdU1FeVVpdGlDVE53bGdPVXh6U25GQ2h4RXREVi1vTWh3bmQ0WUFNTS4iLCJzY3AiOiJBcGlHYXRld2F5Tm9uUHJvZCIsInN1YiI6IjItOEpOUGZsWFlud2RYMFpyWUtoSnBOenU2U25JeW1mTjdDTlJfOG53UDQiLCJ0aWQiOiIxOGE1OWE4MS1lZWE4LTRjMzAtOTQ4YS1kODgyNGNkYzI1ODAiLCJ1dGkiOiJFTFlBRUI0cmdVZXBiSlRZMmhOV0FBIiwidmVyIjoiMi4wIiwidWlkIjoiTDAyNDI1NSIsImVtcGxveWVlX2lkIjoiMzAyNDI1NSJ9.Kg0H3Uy3WeJQ3YHsuX9NE130cvSHFRIwZ8VjMVMkjmVAoypjCRfTeprv4epzlcaj0SPfW7CTp_Ee3tCo2N8Pbv_kolWWh_yMy9H33HKQ6JuePy9008l0T8GuwgQDYZ4IuOAvzKetOJoJy4Y6hp5SeABkYbuGxS65MuFfpQ6qyUftBsb36KyRSr0ZPhhaPTv8liH2wXcg2kfmgq4LtzY-uZDY-82vCoqbBeYLYR11GZsrtOmDHaX3e2pbOaPAYmy_EDDz5Z1Tozd08Q2bsrMsbPKuor617GAmKMzrpuwcy-nFUXZIGlGgR1ze0SXayJ8X2MK_Kq03JIHKUJd1dHBBOQ";

beforeEach(() => {
  cy.setCookie("accessToken", accessToken);
});
/**Create New clicked Scenario */
Given("I am on Homepage", () => {
  cy.visit(`${baseUrl}/`);
});

When("I click on Create New", () => {
  cy.contains("Create New").click();
});

Then("location includes {string}", (url) => {
  cy.url().should("eq", `${url}`);
});
/**Create New clicked Scenario ends here*/

/**Create New Trial Workspace clicked scenario */
Given("I am on Create New Page", () => {
  cy.visit("http://localhost:3000/create-new");
});

When("I click on {string}", (clikedContent) => {
  cy.contains(clikedContent).click();
});

Then("location includes {string}", (url) => {
  cy.url().should("eq", `${url}`);
});
/**Create New Trial Workspace scenario ends here */

/**New Trial Workspace Creation */
Given("I am on Create Trial Workspace", () => {
  cy.url().should("eq", "http://localhost:3000/new-trial-detail/workspace");
});

When("I enter Trial Title", () => {
  cy.get("#trialTitle").type("Test Trial 1");
  cy.wait(1500);
});

When("I enter Trial Notes", () => {
  cy.get("#trialDescription").type(
    "This is only to test Creation of New Trial"
  );
});

When("I select the Therapeutic area as {string}", (therapeuticArea) => {
  cy.get("#therapeuticArea").select("0dac2f53-d6e9-451c-96cc-46d4fb5a056f");
});

When("I select the indication as {string}", (indication) => {
  cy.get("#indication").type(indication);
});

When("I enter the molecule", () => {
  cy.get("#molecule").type("(BIF) Basal Insulin - Fc");
});

When("I enter the duration as {string}", (duration) => {
  cy.get("#duration").type(duration);
});

When("I enter the trial alias as {string}", (alias) => {
  cy.get("#trialAlias").type(alias);
});

And("I click on {string}", (button) => {
  cy.contains(button).click();
});

Then(
  "Trial should be successfully created and redirected to Trial Homepage",
  (url) => {
    cy.visit(
      "http://localhost:3000/trial-homepage/eca6e834-3fe6-4f62-8692-47be3eb6f139"
    );
  }
);
/**New Trial Workspace Creation ends here */
