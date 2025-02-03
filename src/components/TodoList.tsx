import React from "react";
import { IconType } from "react-icons";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  title: string;
  items: Array<{
    name: string;
    type: string;
  }>;
  icon: IconType;
  bgColor: string;
  textColor: string;
  progressColor?: string;
  onItemClick: (item: { name: string; type: string }) => void;
  showProgress?: boolean;
}

export const TodoList = ({
  title,
  items,
  icon,
  bgColor,
  textColor,
  progressColor,
  onItemClick,
  showProgress = false,
}: TodoListProps) => (
  <article
    className="bg-white rounded-xl shadow-md p-6"
    aria-labelledby={`${title.toLowerCase()}-list-title`}
  >
    <header>
      <h2
        id={`${title.toLowerCase()}-list-title`}
        className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"
      >
        <span className={`${bgColor} p-2 rounded`} aria-hidden="true">
          {React.createElement(icon, {
            className: `${textColor} text-lg`,
          })}
        </span>
        {title}
      </h2>
    </header>
    <nav className="space-y-2">
      <ul role="list" className="space-y-2">
        {items.map((item) => (
          <TodoItem
            key={item.name}
            {...item}
            icon={icon}
            bgColor={bgColor}
            textColor={textColor}
            progressColor={progressColor}
            showProgress={showProgress}
            onClick={() => onItemClick(item)}
          />
        ))}
      </ul>
    </nav>
  </article>
);
