import { useState, useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { TodoList } from "./components/TodoList";
import { TodoItem } from "./types/todo";
import {
  addTimestamp,
  removeTimestamp,
  filterItemsByTime,
  filterOutItem,
  getTypeConfig,
  getExpireTime,
} from "./utils/todoUtils";
import todoList from "./data/todo.json";

function App() {
  const [typeLists, setTypeLists] = useState<Record<string, TodoItem[]>>({
    main: todoList,
  });

  const handleItemTransfer = {
    addToTypeList: (item: TodoItem) => {
      setTypeLists((prev) => ({
        ...prev,
        main: filterOutItem(prev.main, item),
        [item.type]: [...(prev[item.type] || []), addTimestamp(item)],
      }));
    },

    removeFromTypeList: (item: TodoItem) => {
      setTypeLists((prev) => ({
        ...prev,
        [item.type]: filterOutItem(prev[item.type], item),
        main: [...prev.main, removeTimestamp(item)],
      }));
    },

    checkExpireTime: (expireTime: number) => {
      setTypeLists((prev) => {
        const updatedLists = { ...prev };
        Object.entries(prev).forEach(([type, items]) => {
          if (type === "main") return;

          const { expired, active } = filterItemsByTime(items, expireTime);
          if (expired.length > 0) {
            updatedLists[type] = active;
            updatedLists.main = [
              ...updatedLists.main,
              ...expired.map(removeTimestamp),
            ];
          }
        });

        return updatedLists;
      });
    },
  };

  useEffect(() => {
    const initializeTypeLists = (
      items: TodoItem[]
    ): Record<string, TodoItem[]> => {
      const uniqueTypes = [...new Set(items.map((item) => item.type))];
      return uniqueTypes.reduce(
        (acc, type) => ({
          ...acc,
          [type]: [],
        }),
        { main: todoList }
      );
    };

    setTypeLists(initializeTypeLists(todoList));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleItemTransfer.checkExpireTime(getExpireTime());
    }, 1);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Interactive Todo List
          </h1>
        </header>

        <section
          className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6"
          aria-label="Todo Lists Container"
        >
          <TodoList
            title="Main List"
            items={typeLists.main}
            icon={FaListUl}
            bgColor="bg-blue-100"
            textColor="text-blue-700"
            onItemClick={handleItemTransfer.addToTypeList}
          />

          {Object.entries(typeLists).map(([type, items]) => {
            if (type === "main") return null;
            const config = getTypeConfig(type);
            return (
              <TodoList
                key={type}
                title={`${type}s`}
                items={items}
                icon={config.icon}
                bgColor={config.bgColor}
                textColor={config.textColor}
                progressColor={config.progressColor}
                onItemClick={handleItemTransfer.removeFromTypeList}
                showProgress
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default App;
