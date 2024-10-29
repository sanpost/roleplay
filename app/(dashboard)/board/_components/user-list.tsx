import React, { useState } from "react";

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
    return <p className="text-center font-pacifico mt-32 text-4xl text-orange-950">try to find someone...</p>;
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
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <button
              className="absolute top-4 right-4 text-3xl h-8 w-8 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedUser.user.username}
            </h2>
            <p className="text-gray-600 mb-2">Bio: {selectedUser.bio}</p>
            <p className="text-gray-600 mb-2">Age: {selectedUser.age}</p>
            <p className="text-gray-600 mb-2">Gender: {selectedUser.gender}</p>
            <p className="text-gray-600 mb-2">
              Preferences: {selectedUser.preferences.length > 0 ? selectedUser.preferences.join(", ") : "None"}
            </p>
            <p className="text-gray-600 mb-2">
              Relationships: {selectedUser.relationships.length > 0 ? selectedUser.relationships.join(", ") : "None"}
            </p>
            <p className="text-gray-600 mb-2">
              Age Ranges: {selectedUser.ageRanges.length > 0 ? selectedUser.ageRanges.join(", ") : "None"}
            </p>
            <div className="mb-2">
              <p className="text-gray-700 mb-2">Contact with Me:</p>
              {selectedUser.contact_methods.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 text-base">
                  {selectedUser.contact_methods.map((method, index) => (
                    <li key={index} className="mb-2">
                      {method}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">None</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
