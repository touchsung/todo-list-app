import { describe, it, expect } from "vitest";
import {
  addTimestamp,
  removeTimestamp,
  filterItemsByTime,
  filterOutItem,
  getTypeConfig,
} from "../todoUtils";
import { FaAppleAlt, FaCarrot, FaBox } from "react-icons/fa";
import { TodoItem } from "../../types/todo";

describe("todoUtils", () => {
  describe("addTimestamp", () => {
    it("adds timestamp to todo item", () => {
      const item: TodoItem = { type: "Fruit", name: "Apple" };
      const result = addTimestamp(item);
      
      expect(result.type).toBe("Fruit");
      expect(result.name).toBe("Apple");
      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe("number");
    });

    it("preserves existing item properties", () => {
      const item = { type: "Fruit", name: "Apple", extra: "data" };
      const result = addTimestamp(item);
      
      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe("number");
    });
  });

  describe("removeTimestamp", () => {
    it("removes timestamp from todo item", () => {
      const item = { type: "Fruit", name: "Apple", timestamp: Date.now() };
      const result = removeTimestamp(item);
      
      expect(result).toEqual({
        type: "Fruit",
        name: "Apple",
      });
      expect(result.timestamp).toBeUndefined();
    });

    it("works with items that have no timestamp", () => {
      const item = { type: "Fruit", name: "Apple" };
      const result = removeTimestamp(item);
      
      expect(result).toEqual({
        type: "Fruit",
        name: "Apple",
      });
    });
  });

  describe("filterItemsByTime", () => {
    const items = [
      { type: "Fruit", name: "Apple", timestamp: Date.now() - 6000 },
      { type: "Fruit", name: "Banana", timestamp: Date.now() - 2000 },
      { type: "Fruit", name: "Orange", timestamp: Date.now() },
    ];

    it("correctly separates expired and active items", () => {
      const currentTime = Date.now();
      const expireTime = 5000;
      
      const result = filterItemsByTime(items, currentTime, expireTime);
      
      expect(result.expired).toHaveLength(1);
      expect(result.expired[0].name).toBe("Apple");
      expect(result.active).toHaveLength(2);
      expect(result.active.map(item => item.name)).toEqual(["Banana", "Orange"]);
    });

    it("handles items with no timestamp", () => {
      const itemsWithoutTimestamp = [
        { type: "Fruit", name: "Apple" },
        { type: "Fruit", name: "Banana", timestamp: Date.now() },
      ];
      
      const result = filterItemsByTime(itemsWithoutTimestamp, Date.now(), 5000);
      
      expect(result.expired).toHaveLength(1);
      expect(result.expired[0].name).toBe("Apple");
    });

    it("handles empty array", () => {
      const result = filterItemsByTime([], Date.now(), 5000);
      
      expect(result.expired).toHaveLength(0);
      expect(result.active).toHaveLength(0);
    });
  });

  describe("filterOutItem", () => {
    const items = [
      { type: "Fruit", name: "Apple" },
      { type: "Fruit", name: "Banana" },
      { type: "Vegetable", name: "Carrot" },
    ];

    it("removes specified item from array", () => {
      const itemToRemove = { type: "Fruit", name: "Apple" };
      const result = filterOutItem(items, itemToRemove);
      
      expect(result).toHaveLength(2);
      expect(result.find(item => item.name === "Apple")).toBeUndefined();
      expect(result.map(item => item.name)).toEqual(["Banana", "Carrot"]);
    });

    it("returns same array if item not found", () => {
      const itemToRemove = { type: "Fruit", name: "Mango" };
      const result = filterOutItem(items, itemToRemove);
      
      expect(result).toHaveLength(3);
      expect(result).toEqual(items);
    });

    it("handles empty array", () => {
      const result = filterOutItem([], { type: "Fruit", name: "Apple" });
      expect(result).toHaveLength(0);
    });
  });

  describe("getTypeConfig", () => {
    it("returns Fruit configuration", () => {
      const config = getTypeConfig("Fruit");
      
      expect(config).toEqual({
        icon: FaAppleAlt,
        bgColor: "bg-orange-50",
        hoverBgColor: "hover:bg-orange-100",
        textColor: "text-orange-700",
        progressColor: "bg-orange-200",
      });
    });

    it("returns Vegetable configuration", () => {
      const config = getTypeConfig("Vegetable");
      
      expect(config).toEqual({
        icon: FaCarrot,
        bgColor: "bg-green-50",
        hoverBgColor: "hover:bg-green-100",
        textColor: "text-green-700",
        progressColor: "bg-green-200",
      });
    });

    it("returns default configuration for unknown type", () => {
      const config = getTypeConfig("Unknown");
      
      expect(config).toEqual({
        icon: FaBox,
        bgColor: "bg-gray-50",
        hoverBgColor: "hover:bg-gray-100",
        textColor: "text-gray-700",
        progressColor: "bg-gray-200",
      });
    });
  });
}); 