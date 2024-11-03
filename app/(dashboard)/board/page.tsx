"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SearchForm from "./_components/form-search";
import UserList from "./_components/user-list";
import { Footer } from "@/app/_components/footer";

// Define the User interface
interface ContactMethod {
  name: string;
  link: string;
}

interface User {
  id: number;
  user: {
    username: string;
  };
  bio: string;
  age: number;
  gender: string;
  preferences: string[]; 
  relationships: string[];
  ageRanges: string[];
  contact_methods: ContactMethod[];
}

export default function CatalogPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Dodano stan isLoading

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true); // Ustawiamy isLoading na true przed rozpoczęciem pobierania
      try {
        const response = await fetch("/api/users/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferences: [],
            relationships: [],
            ageRanges: [],
          }),
        });

        const data = await response.json();
        setUsers(data);
        setIsLoading(false); // Ustawiamy isLoading na false po zakończeniu pobierania
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false); // Ustawiamy isLoading na false w przypadku błędu
        toast.error("Wystąpił błąd podczas pobierania użytkowników. Spróbuj ponownie.");
      }
    };

    fetchAllUsers();
  }, []);

  const handleSearch = async (searchData: any): Promise<User[]> => {
    setIsLoading(true); // Ustawiamy isLoading na true przed rozpoczęciem wyszukiwania
    try {
      const response = await fetch("/api/users/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      setUsers(data);
      setIsLoading(false); // Ustawiamy isLoading na false po zakończeniu wyszukiwania

      // Check if users were found
      if (!searchData.preferences.length && !searchData.relationships.length && !searchData.ageRanges.length) {
        toast.info("Nie wybrano kategorii – wyświetlono wszystkich użytkowników.");
      } else if (data.length > 0) {
        toast.success(`Znaleziono ${data.length} pasujących użytkowników!`);
      } else {
        toast.warn("Brak pasujących użytkowników na podstawie wybranych kategorii.");
      }
      
      return data; 
    } catch (error) {
      console.error("Error searching users:", error);
      setIsLoading(false); // Ustawiamy isLoading na false w przypadku błędu
      toast.error("Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie.");
      return []; 
    }
  };

  const handleRandomUser = (user: User) => {
    setUsers([]);
    setUsers((prevUsers) => [...prevUsers, user]);
    toast.success(`Wylosowano użytkownika: ${user.user.username}`);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h1 className="text-center text-2xl font-pacifico">Bored? Find someone!</h1>
      <div className="flex flex-row h-full w-full overflow-hidden">
        <div className="xl:w-1/2 w-3/5 flex-shrink-0 overflow-auto">
          <div className="sticky top-0 z-10">
            <SearchForm onSearch={handleSearch} onRandomUser={handleRandomUser} />
          </div>
        </div>
        <div className="xl:w-1/2 w-2/5 h-full overflow-auto mt-2 border-l-4 border-dotted border-orange-950">
          <div className="flex flex-col">
            <div className="flex-grow overflow-auto p-6">
              <UserList users={users} isLoading={isLoading} /> {/* Przekazujemy isLoading */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
