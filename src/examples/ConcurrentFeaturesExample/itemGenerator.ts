// Generate dummy data for concurrent features demo

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

export const generateItems = (count: number): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    category: ['electronics', 'clothing', 'books', 'toys'][i % 4],
    price: Math.floor(Math.random() * 1000) + 10,
  }));
};

// Simulate expensive filtering with artificial delay
export const expensiveFilter = (items: Item[], query: string): Item[] => {
  const start = Date.now();
  while (Date.now() - start < 20) {
    // Busy wait to simulate heavy computation
  }

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );
};
