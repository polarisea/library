import { createContext, useState } from "react";
import { apiService } from "../services/api";
const BookContext = createContext();

// eslint-disable-next-line react/prop-types
function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("count");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [search, setSearch] = useState("");

  const fetchBooks = async (params) => {
    if (loading) return;
    setLoading(true);
    setBooks([]);
    console.log("Set search: ", search);
    try {
      const { data } = await apiService.get("/books", {
        params: {
          sort,
          author: selectedAuthor,
          category: selectedCategory,
          search,
          ...params,
        },
      });
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const fetchTotal = async (params) => {
    try {
      const { data } = await apiService.get("/books/count", {
        params: {
          author: selectedAuthor,
          category: selectedCategory,
          search,
          ...params,
        },
      });
      setTotal(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const { data } = await apiService.get("/authors");
      setAuthors(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const { data } = await apiService.get("/categories");
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    books,
    total,
    sort,
    authors,
    categories,
    selectedAuthor,
    selectedCategory,
    search,
    setBooks,
    setSelectedAuthor,
    setSort,
    setSelectedCategory,
    setSearch,
    fetchBooks,
    fetchTotal,
    fetchAuthors,
    fetchCategories,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export { BookContext, BookProvider };
