import React from "react";
import {
  render,
  // fireEvent, 
  screen
} from "@testing-library/react";
import HeaderLink from "../HeaderLink";
import { BrowserRouter } from "react-router-dom";

const MockHistoryLink = () => {
  const linkMessage = 'Link';
  return (
    <>
      <BrowserRouter>
        <HeaderLink
          link="/"
          color="default"
          activePath="/"
          style={{}}
          analyticsOptions={{ action: "browse", labels: ["my trials"] }}>
          {linkMessage}
        </HeaderLink>
      </BrowserRouter>
    </>
  )
}


test("show header link", () => {
  render(<MockHistoryLink />)
  expect(screen.getByText("Link")).toBeDefined();
})
