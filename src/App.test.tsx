import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import App from "./App";

describe("Todo App Integration Tests", () => {
  beforeEach(() => {
    // Reset timers before each test
    vi.useFakeTimers();
  });

  it("transfers items from main list to type list when clicked", () => {
    render(<App />);

    // Click on an Apple in the main list
    const appleItem = screen.getByText("Apple");
    fireEvent.click(appleItem);

    // Apple should now be in the Fruits list
    const fruitsList = screen.getByText("Fruits").closest("section");
    expect(fruitsList).toContainElement(screen.getByText("Apple"));

    // Apple should not be visible in the main list anymore
    const mainListItems = screen
      .getByText("Main List")
      .closest("section")
      ?.querySelectorAll(".todo-item:not(.hidden)");
    const visibleApples = Array.from(mainListItems || []).filter((item) =>
      item.textContent?.includes("Apple")
    );
    expect(visibleApples.length).toBe(0);
  });

  it("transfers items back to main list when clicked in type list", () => {
    render(<App />);

    // Transfer Apple to Fruits list
    const appleItem = screen.getByText("Apple");
    fireEvent.click(appleItem);

    // Click Apple in Fruits list to transfer back
    const appleInFruitsList = screen.getByText("Apple");
    fireEvent.click(appleInFruitsList);

    // Apple should be back in the main list
    const mainList = screen.getByText("Main List").closest("section");
    expect(mainList).toContainElement(screen.getByText("Apple"));

    // Apple should not be in Fruits list anymore
    const fruitsList = screen.getByText("Fruits").closest("section");
    const fruitsListItems = fruitsList?.querySelectorAll(
      ".todo-item:not(.hidden)"
    );
    const visibleApples = Array.from(fruitsListItems || []).filter((item) =>
      item.textContent?.includes("Apple")
    );
    expect(visibleApples.length).toBe(0);
  });

  it("transfers items back to main list after timer expires", async () => {
    render(<App />);

    // Transfer Apple to Fruits list
    const appleItem = screen.getByText("Apple");
    fireEvent.click(appleItem);

    // Advance timer by 5 seconds (more than the expiry time)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Apple should be back in the main list
    const mainList = screen.getByText("Main List").closest("section");
    expect(mainList).toContainElement(screen.getByText("Apple"));
  });
});
