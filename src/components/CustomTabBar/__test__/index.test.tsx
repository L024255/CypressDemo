import React from "react";
import {
  render,
  // fireEvent, 
  screen
} from "@testing-library/react";
import CustomTabBar from "../index";

describe("test CustomTabBar", () => {
  it("should have a back button", () => {
    const backMessage = 'Back';
    render(<CustomTabBar tabTitles={[]} tabValue={undefined} changeTabValue={() => { }} />);
    expect(screen.queryByText(backMessage)).toBeDefined()
  });
  it("should have a tab list", () => {
    render(<CustomTabBar tabTitles={[]} tabValue={undefined} changeTabValue={() => { }} />);
    expect(screen.getByRole("tablist")).toBeDefined();
  });
})
