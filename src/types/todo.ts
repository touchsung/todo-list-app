import { IconType } from "react-icons";

export interface TodoItem {
  type: string;
  name: string;
  timestamp?: number;
}

export interface TypeConfig {
  icon: IconType;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  progressColor: string;
} 