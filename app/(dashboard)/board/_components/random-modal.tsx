import React from 'react';

interface User {
  username: string;
  bio: string;
  age: number;
  gender: string;
  preferences: string[];
  relationships: string[];
  ageRanges: string[];
  contact_methods: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // Zdefiniowany typ użytkownika
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null; // Jeśli modal nie jest otwarty, nie renderuj nic

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
        <button
          className="absolute top-4 right-4 text-3xl h-8 w-8 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {user.username}
        </h2>
        <p className="text-gray-600 mb-2">Bio: {user.bio}</p>
        <p className="text-gray-600 mb-2">Age: {user.age}</p>
        <p className="text-gray-600 mb-2">Gender: {user.gender}</p>
        <p className="text-gray-600 mb-2">
          Preferences: {user.preferences.length > 0 ? user.preferences.join(", ") : "None"}
        </p>
        <p className="text-gray-600 mb-2">
          Relationships: {user.relationships.length > 0 ? user.relationships.join(", ") : "None"}
        </p>
        <p className="text-gray-600 mb-2">
          Age Ranges: {user.ageRanges.length > 0 ? user.ageRanges.join(", ") : "None"}
        </p>
        <div className="mb-2">
          <p className="text-gray-700 mb-2">Contact with Me:</p>
          {user.contact_methods.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 text-base">
              {user.contact_methods.map((method, index) => (
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
  );
};

export default Modal;
