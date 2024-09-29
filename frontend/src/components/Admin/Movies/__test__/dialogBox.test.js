import { render, screen, fireEvent } from "@testing-library/react";
import AlertDialog from "../DialogBox"; // Adjust the path as necessary
import "@testing-library/jest-dom";

describe("AlertDialog component", () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation; 
  });

  test("renders the dialog with the provided message", () => {
    render(<AlertDialog message="Form submitted successfully!" reload={false} />);

    expect(screen.getByText("Form Submission")).toBeInTheDocument();
    expect(screen.getByText("Form submitted successfully!")).toBeInTheDocument();
  });

  test("dialog starts as open", () => {
    render(<AlertDialog message="Form submitted successfully!" reload={false} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });



  test("reloads the page after closing if reload prop is true", () => {
    render(<AlertDialog message="Form submitted successfully!" reload={true} />);
    const closeButton = screen.getByText("Okay");
    fireEvent.click(closeButton);
    expect(window.location.reload).toHaveBeenCalled();
  });

  test("does not reload the page if reload prop is false", () => {
    render(<AlertDialog message="Form submitted successfully!" reload={false} />);
    const closeButton = screen.getByText("Okay");
    fireEvent.click(closeButton);
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
