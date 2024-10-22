import React from "react";
import ReviewList from "./ShowReviewList";

describe("<ReviewList />", () => {
  it("renders", () => {
    cy.mount(<ReviewList />);
  });
});
