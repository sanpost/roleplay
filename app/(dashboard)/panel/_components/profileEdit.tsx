import React, { useEffect, useState } from "react";

interface ProfileEditFormProps {
  email: string;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ email }) => {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    age: undefined as number | undefined,
    preferences: "",
    ageRange: "",
    relationship: "",
    gender: "",
    contactMethod: "",
  });

  const [options, setOptions] = useState({
    preferencesList: [] as string[],
    ageRangeList: [] as string[],
    relationshipList: [] as string[],
    genderList: [] as string[],
    contactMethodList: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/profile/${email}`);
        const data = await response.json();

        if (response.ok) {
          const { username, profile } = data.user;
          setFormData({
            username,
            bio: profile?.bio || "",
            age: profile?.age,
            preferences: profile?.preferences || "",
            ageRange: profile?.age_range || "",
            relationship: profile?.relationship || "",
            gender: profile?.gender || "",
            contactMethod: profile?.contact_methods || "",
          });

          setOptions({
            preferencesList: data.preferences.map((pref: any) => pref.name),
            ageRangeList: data.ageRanges.map((range: any) => range.name),
            relationshipList: data.relationships.map((rel: any) => rel.name),
            genderList: data.genders.map((gen: any) => gen.name),
            contactMethodList: data.contactMethod.map((method: any) => method.name),
          });
        } else {
          console.error("Error fetching profile data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [email]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/profile/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, email }),
    });

    if (response.ok) {
      console.log("Profile updated successfully");
      // Optionally, show feedback to the user
    } else {
      const errorData = await response.json();
      console.error("Failed to update profile:", errorData.message);
    }
  };

  const renderSelect = (
    label: string,
    name: string,
    value: string,
    options: string[]
  ) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-auto max-w-full mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div className="flex flex-col w-1/2 p-4 space-y-4">
        <div className="h-full overflow-y-auto">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2 p-4 space-y-4">
        <div className="h-full overflow-y-auto">
          {renderSelect(
            "Preferences",
            "preferences",
            formData.preferences,
            options.preferencesList
          )}
          {renderSelect(
            "Age Range",
            "ageRange",
            formData.ageRange,
            options.ageRangeList
          )}
          {renderSelect(
            "Relationship",
            "relationship",
            formData.relationship,
            options.relationshipList
          )}
          {renderSelect(
            "Gender",
            "gender",
            formData.gender,
            options.genderList
          )}
          {renderSelect(
            "Contact Method",
            "contactMethod",
            formData.contactMethod,
            options.contactMethodList
          )}
          <button
            type="submit"
            className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Profile
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileEditForm;
