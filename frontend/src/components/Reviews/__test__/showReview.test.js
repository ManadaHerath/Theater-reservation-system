import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewList from "../ShowReviewList";
import reviews from "./mockData.js";

describe("ShowReviewList", () => {
  it("should render the list of reviews", () => {
    render(<ReviewList reviews={reviews} />);
    const reviewElements = screen.getAllByTestId("review");
    expect(reviewElements).toHaveLength(reviews.length);
  });
  it("should render 'No reviews available' when there are no reviews", () => {
    render(<ReviewList />);
    const noReviews = screen.getByText(/No reviews available/i);
    expect(noReviews).toBeInTheDocument();
  });
});
