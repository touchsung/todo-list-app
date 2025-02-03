import { IconType } from "react-icons";

interface TodoItemProps {
  name: string;
  type: string;
  icon: IconType;
  bgColor: string;
  textColor: string;
  onClick: () => void;
  showProgress?: boolean;
  progressColor?: string;
}

export const TodoItem = ({
  name,
  type,
  icon: Icon,
  bgColor,
  textColor,
  onClick,
  showProgress = false,
  progressColor,
}: TodoItemProps) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg ${bgColor} ${textColor}
        transition-colors duration-200 flex items-center justify-between group relative overflow-hidden cursor-pointer`}
      aria-label={
        showProgress
          ? `Return ${name} to main list`
          : `Move ${name} to ${type} list`
      }
    >
      <span className="relative z-10 flex items-center gap-2">
        <span aria-hidden="true">
          <Icon className="text-sm" />
        </span>
        {name}
      </span>
      {showProgress && progressColor && (
        <div
          className={`absolute bottom-0 left-0 h-1 ${progressColor} w-full 
            origin-left animate-[progressBar_5s_linear]`}
          role="progressbar"
          aria-label={`Timer for ${name}`}
        />
      )}
    </button>
  </li>
);
