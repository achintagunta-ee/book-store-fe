// A mock function to mimic making an async request for data
export const fetchBooks = async () => {
  // In a real app, you would make a network request here, e.g., using fetch or axios
  // const response = await fetch('https://api.bookstore.com/books');
  // const data = await response.json();
  // return data;

  // For now, we'll simulate a network request with a timeout
  return new Promise<{ data: any[] }>((resolve) =>
    setTimeout(
      () => resolve({ data: [{ id: 1, title: "The Great Gatsby" }] }),
      500
    )
  );
};
