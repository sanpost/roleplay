"use client";
import { useState } from "react";
import SearchForm from "./_components/form-search";
import UserList from "./_components/user-list";

export default function CatalogPage() {
  const [users, setUsers] = useState([]);

  const handleSearch = async (searchData: any) => {
    try {
      const response = await fetch("/api/users/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      console.log('Found users:', users);
      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <h1 className="text-center text-2xl font-pacifico">Bored? Find someone!</h1>
      <div className="flex flex-row h-full w-full overflow-hidden">
        <div className="xl:w-1/2 w-3/5 flex-shrink-0 overflow-auto">
          <div className="sticky top-0 z-10">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
        <div className="xl:w-1/2 w-2/5 h-full overflow-auto">
          <div className="h-full flex flex-col">
            <div className="flex-grow overflow-auto p-6">
              <UserList users={users} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
