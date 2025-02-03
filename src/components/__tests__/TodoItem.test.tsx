import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../TodoItem";
import { FiCoffee } from "react-icons/fi";

describe("TodoItem", () => {
  const defaultProps = {
    name: "Coffee Break",
    type: "break",
    icon: FiCoffee,
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    onClick: vi.fn(),
  };

  it("renders with basic props", () => {
    render(<TodoItem {...defaultProps} />);

    expect(screen.getByText("Coffee Break")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass(
      "bg-blue-100",
      "text-blue-800"
    );
  });

  it("calls onClick when clicked", () => {
    render(<TodoItem {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("shows correct aria-label for main list item", () => {
    render(<TodoItem {...defaultProps} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Move Coffee Break to break list"
    );
  });

  it("shows correct aria-label for progress item", () => {
    render(<TodoItem {...defaultProps} showProgress={true} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Return Coffee Break to main list"
    );
  });

  it("renders progress bar when showProgress is true", () => {
    render(
      <TodoItem
        {...defaultProps}
        showProgress={true}
        progressColor="bg-blue-500"
      />
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass("bg-blue-500");
    expect(progressBar).toHaveAttribute("aria-label", "Timer for Coffee Break");
  });

  it("does not render progress bar when showProgress is false", () => {
    render(<TodoItem {...defaultProps} />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
