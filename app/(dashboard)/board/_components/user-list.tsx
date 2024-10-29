import React, { useState } from "react";

interface User {
  id: number;
  user: {
    username: string;
  };
  bio: string;
  age: number;
  gender: string;
  preferences: string[]; // Teraz jako tablica stringów
  relationships: string[];
  ageRanges: string[];
  contact_methods: string[];
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if (!Array.isArray(users) || users.length === 0) {
    return <p className="text-center text-gray-500">No users found.</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-lg shadow-lg p-6 mb-4 transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleUserClick(user)}
        >
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {user.user.username} ({user.gender})
            </h3>
            <span className="text-gray-600">{user.age} years</span>
          </div>
          <p className="text-gray-600 mt-2">{user.bio}</p>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedUser.user.username}
            </h2>
            <p className="text-gray-600">Bio: {selectedUser.bio}</p>
            <p className="text-gray-600">Age: {selectedUser.age}</p>
            <p className="text-gray-600">Gender: {selectedUser.gender}</p>
            <p className="text-gray-600">
              Preferences:{" "}
              {selectedUser.preferences.length > 0
                ? selectedUser.preferences.join(", ")
                : "None"}
            </p>
            <p className="text-gray-600">
              Relationships:{" "}
              {selectedUser.relationships.length > 0
                ? selectedUser.relationships.join(", ")
                : "None"}
            </p>
            <p className="text-gray-600">
              Age Ranges:{" "}
              {selectedUser.ageRanges.length > 0
                ? selectedUser.ageRanges.join(", ")
                : "None"}
            </p>
            <p className="text-gray-600">
              Contact with Me:{" "}
              {selectedUser.contact_methods.length > 0
                ? selectedUser.contact_methods.join(", ")
                : "None"}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
