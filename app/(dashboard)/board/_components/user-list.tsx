import React, { useState } from "react";

interface User {
  id: number;
  user: {
    username: string;
  };
  bio: string;
  age: number;
  preferences: string;
  relationship: string;
  age_range: string;
  gender: string;
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

  if (users.length === 0) {
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedUser?.user.username}
            </h2>
            <p className="text-gray-600">Bio: {selectedUser?.bio}</p>
            <p className="text-gray-600">Age: {selectedUser?.age}</p>
            <p className="text-gray-600">
              Preferences: {selectedUser?.preferences}
            </p>
            <p className="text-gray-600">
              Relationship: {selectedUser?.relationship}
            </p>
            <p className="text-gray-600">
              Age Range: {selectedUser?.age_range}
            </p>
            <p className="text-gray-600">Gender: {selectedUser?.gender}</p>
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