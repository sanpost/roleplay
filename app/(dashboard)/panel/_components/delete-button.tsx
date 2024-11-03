// delete-button.tsx

import React from 'react';

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent) => Promise<void>;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  return (
    <div className="items-center">
      <button
        onClick={onDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Delete your account
      </button>
    </div>
  );
};

export default DeleteButton;
