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
} from "./utils/todoUtils";
import todoList from "./data/todo.json";

function App() {
  const [mainList, setMainList] = useState<TodoItem[]>(todoList);
  const [typeLists, setTypeLists] = useState<Record<string, TodoItem[]>>({});

  const handleItemTransfer = {
    toTypeList: (item: TodoItem) => {
      setMainList((prev) => filterOutItem(prev, item));
      setTypeLists((prev) => ({
        ...prev,
        [item.type]: [...(prev[item.type] || []), addTimestamp(item)],
      }));
    },

    toMainList: (item: TodoItem) => {
      setTypeLists((prev) => ({
        ...prev,
        [item.type]: filterOutItem(prev[item.type], item),
      }));
      setMainList((prev) => [...prev, removeTimestamp(item)]);
    },
  };

  // Initialize lists
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
        {}
      );
    };

    setTypeLists(initializeTypeLists(todoList));
  }, []);

  // Timer effect
  useEffect(() => {
    const processExpiredItems = () => {
      const currentTime = Date.now();

      setTypeLists((prevTypeLists) => {
        let hasChanges = false;
        const newTypeLists = { ...prevTypeLists };
        const expiredItems: TodoItem[] = [];

        // Process each type list
        Object.entries(prevTypeLists).forEach(([type, items]) => {
          const { expired, active } = filterItemsByTime(items, currentTime);
          if (expired.length > 0) {
            hasChanges = true;
            newTypeLists[type] = active;
            expiredItems.push(...expired.map(removeTimestamp));
          }
        });

        // Update main list if there are expired items
        if (hasChanges) {
          setMainList((prev) => [...prev, ...expiredItems]);
          return newTypeLists;
        }

        return prevTypeLists;
      });
    };

    const timer = setInterval(processExpiredItems, 500);
    return () => clearInterval(timer);
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
            items={mainList}
            icon={FaListUl}
            bgColor="bg-blue-100"
            textColor="text-blue-700"
            onItemClick={handleItemTransfer.toTypeList}
          />

          {Object.entries(typeLists).map(([type, items]) => {
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
                onItemClick={handleItemTransfer.toMainList}
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
