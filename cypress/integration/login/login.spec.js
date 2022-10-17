/* eslint-disable no-undef */
/// <reference types="cypress" />
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

const baseUrl = Cypress.env("baseUrl");
const accessToken ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIyOWNkMzFlNS0wYWM1LTQ0MWMtYjQzNS03ZWEwYzg3MDlkZGUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMThhNTlhODEtZWVhOC00YzMwLTk0OGEtZDg4MjRjZGMyNTgwL3YyLjAiLCJpYXQiOjE2NTIxNjIxNjQsIm5iZiI6MTY1MjE2MjE2NCwiZXhwIjoxNjUyMTY2NDE4LCJhaW8iOiJBVVFBdS84VEFBQUFZM2lnNFRzcFFKeEcrejE2Mm1uVEI0RjVPcEx2MzdubEVXOTEvcE1CcnlYTkxRaTZ1TG5CdWdxTDZzclB4R1Q1Vk5xUUl4MHN5MDllVTVHdmR6TWhKUT09IiwiYXpwIjoiNTQ0ZWY2MTYtNzgyOS00YWY2LTliZDgtNjAzY2ViODE0YjAxIiwiYXpwYWNyIjoiMSIsIm5hbWUiOiJCZWxsYXJlIFNoYWxpbmkgUGFpIiwib2lkIjoiYTZmMjU3NzEtZGVkZC00ODU5LTg1ZDQtMWY4MDA2ZjA2MzhkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicGFpX3NoYWxpbmlAbGlsbHkuY29tIiwicmgiOiIwLkFSZ0FnWnFsR0tqdU1FeVVpdGlDVE53bGdPVXh6U25GQ2h4RXREVi1vTWh3bmQ0WUFNTS4iLCJzY3AiOiJBcGlHYXRld2F5Tm9uUHJvZCIsInN1YiI6IjItOEpOUGZsWFlud2RYMFpyWUtoSnBOenU2U25JeW1mTjdDTlJfOG53UDQiLCJ0aWQiOiIxOGE1OWE4MS1lZWE4LTRjMzAtOTQ4YS1kODgyNGNkYzI1ODAiLCJ1dGkiOiJFTFlBRUI0cmdVZXBiSlRZMmhOV0FBIiwidmVyIjoiMi4wIiwidWlkIjoiTDAyNDI1NSIsImVtcGxveWVlX2lkIjoiMzAyNDI1NSJ9.Kg0H3Uy3WeJQ3YHsuX9NE130cvSHFRIwZ8VjMVMkjmVAoypjCRfTeprv4epzlcaj0SPfW7CTp_Ee3tCo2N8Pbv_kolWWh_yMy9H33HKQ6JuePy9008l0T8GuwgQDYZ4IuOAvzKetOJoJy4Y6hp5SeABkYbuGxS65MuFfpQ6qyUftBsb36KyRSr0ZPhhaPTv8liH2wXcg2kfmgq4LtzY-uZDY-82vCoqbBeYLYR11GZsrtOmDHaX3e2pbOaPAYmy_EDDz5Z1Tozd08Q2bsrMsbPKuor617GAmKMzrpuwcy-nFUXZIGlGgR1ze0SXayJ8X2MK_Kq03JIHKUJd1dHBBOQ";
beforeEach(() => {
  cy.setCookie("accessToken", accessToken);
});

Given("User is at the login page", () => {
  cy.visit(`${baseUrl}/`);
});

When("User is successfully logged in", () => {
  cy.getCookie("accessToken").then((c) => {
    cy.log(c.value);
  });
});

Then("User is redirected to Homepage", () => {
  cy.get('h1').should('have.text', 'Bellare, welcome to your SD DIO Workspace');
});

Then("It should see the users initial on top",()=>{
   const userInitial = cy.get('.MuiAvatar-root');
   userInitial.should('be.visible');
   userInitial.should('have.text','BP');
});
