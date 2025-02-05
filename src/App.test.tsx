import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("renders the main layout correctly", () => {
    render(<App />);

    expect(screen.getByText("Interactive Todo List")).toBeInTheDocument();
    expect(screen.getByText("Main List")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("min-h-screen", "bg-gray-50");
  });

  it("displays initial todo items in the main list", () => {
    render(<App />);

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Broccoli")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("moves items to appropriate type list when clicked", () => {
    render(<App />);

    const appleItem = screen.getByText("Apple");
    fireEvent.click(appleItem);

    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Return Apple to main list/i })
    ).toBeInTheDocument();
  });

  it("returns items to main list after expiration time", async () => {
    render(<App />);

    // Move item to type list
    const appleItem = screen.getByText("Apple");
    fireEvent.click(appleItem);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Item should be back in main list
    expect(
      screen.getByRole("button", { name: /Move Apple to Fruit list/i })
    ).toBeInTheDocument();
  });

  it("allows manual return of items to main list", () => {
    render(<App />);

    // Move item to type list
    const bananaItem = screen.getByText("Banana");
    fireEvent.click(bananaItem);

    // Click to return item
    const returnButton = screen.getByRole("button", {
      name: /Return Banana to main list/i,
    });
    fireEvent.click(returnButton);

    // Item should be back in main list
    expect(
      screen.getByRole("button", { name: /Move Banana to Fruit list/i })
    ).toBeInTheDocument();
  });

  it("shows progress bar for items in type lists", () => {
    render(<App />);

    const tomatoItem = screen.getByText("Tomato");
    fireEvent.click(tomatoItem);

    expect(
      screen.getByRole("progressbar", { name: /Timer for Tomato/i })
    ).toBeInTheDocument();
  });

  it("maintains separate lists for different types", () => {
    render(<App />);

    // Move items of different types
    fireEvent.click(screen.getByText("Apple")); // Fruit
    fireEvent.click(screen.getByText("Broccoli")); // Vegetable

    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Vegetables")).toBeInTheDocument();
  });
});
