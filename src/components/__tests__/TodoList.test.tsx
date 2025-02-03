import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "../TodoList";
import { FiCheckCircle } from "react-icons/fi";

describe("TodoList", () => {
  const mockProps = {
    title: "Test Tasks",
    items: [
      { name: "Task 1", type: "test" },
      { name: "Task 2", type: "test" },
    ],
    icon: FiCheckCircle,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    progressColor: "bg-blue-500",
    onItemClick: vi.fn(),
    showProgress: false,
  };

  it("renders the title correctly", () => {
    render(<TodoList {...mockProps} />);
    expect(screen.getByText("Test Tasks")).toBeInTheDocument();
  });

  it("renders all todo items", () => {
    render(<TodoList {...mockProps} />);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("calls onItemClick with correct item when clicked", () => {
    render(<TodoList {...mockProps} />);
    fireEvent.click(screen.getByText("Task 1"));
    expect(mockProps.onItemClick).toHaveBeenCalledWith({
      name: "Task 1",
      type: "test",
    });
  });

  it("applies correct aria attributes", () => {
    render(<TodoList {...mockProps} />);
    expect(screen.getByRole("article")).toHaveAttribute(
      "aria-labelledby",
      "test tasks-list-title"
    );
    expect(screen.getByRole("heading")).toHaveAttribute(
      "id",
      "test tasks-list-title"
    );
  });

  it("renders with correct styling classes", () => {
    render(<TodoList {...mockProps} />);
    expect(screen.getByRole("article")).toHaveClass(
      "bg-white",
      "rounded-xl",
      "shadow-md",
      "p-6"
    );
  });
});
