import { TodoItem, TypeConfig } from "../types/todo";
import {  FaAppleAlt, FaCarrot, FaBox } from "react-icons/fa";

export const addTimestamp = (item: TodoItem): TodoItem => ({
  ...item,
  timestamp: Date.now(),
});

export const removeTimestamp = ({ type, name }: TodoItem): TodoItem => ({
  type,
  name,
});

export const filterItemsByTime = (
  items: TodoItem[],
  currentTime: number
): {
  expired: TodoItem[];
  active: TodoItem[];
} => {
  const isExpired = (item: TodoItem) =>
    currentTime - (item.timestamp || 0) >= 5000;

  return {
    expired: items.filter(isExpired),
    active: items.filter((item) => !isExpired(item)),
  };
};

export const filterOutItem = (items: TodoItem[], itemToRemove: TodoItem): TodoItem[] =>
  items.filter((item) => item.name !== itemToRemove.name); 

export const getTypeConfig = (type: string): TypeConfig => {
  switch (type) {
    case "Fruit":
      return {
          icon: FaAppleAlt,
          bgColor: "bg-orange-50",
          hoverBgColor: "hover:bg-orange-100",
          textColor: "text-orange-700",
          progressColor: "bg-orange-200",
        };
      case "Vegetable":
        return {
          icon: FaCarrot,
          bgColor: "bg-green-50",
          hoverBgColor: "hover:bg-green-100",
          textColor: "text-green-700",
          progressColor: "bg-green-200",
        };
      default:
        return {
          icon: FaBox,
          bgColor: "bg-gray-50",
          hoverBgColor: "hover:bg-gray-100",
          textColor: "text-gray-700",
          progressColor: "bg-gray-200",
        };
    }
  };