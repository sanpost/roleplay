import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProfileEditFormProps {
  email: string;
}

interface FormData {
  username: string;
  bio: string;
  age: number | undefined;
  gender: string;
  ageRange: number[];         // Should be an array of numbers (IDs)
  relationship: number[];     // Should be an array of numbers (IDs)
  contactMethod: number[];    // Should be an array of numbers (IDs)
  preferences: number[];       // Should be an array of numbers (IDs)
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ email }) => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    bio: "",
    age: undefined,
    gender: "",
    ageRange: [],
    relationship: [],
    contactMethod: [],
    preferences: [],
  });

  const [options, setOptions] = useState({
    ageRangeList: [] as { id: number; name: string }[],
    relationshipList: [] as { id: number; name: string }[],
    contactMethodList: [] as { id: number; name: string }[],
    preferencesList: [] as { id: number; name: string }[],
    genderList: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/profile/${email}`);
        const data = await response.json();
    
        console.log(data); // Debugging line
    
        if (response.ok) {
          const { username, profile } = data.user;
    
          const preferencesIds = profile.preferences || [];
          const ageRangeIds = profile.age_range || [];
          const relationshipIds = profile.relationship || [];
          const contactMethodIds = profile.contact_methods || [];
    
          setFormData({
            username,
            bio: profile?.bio || "",
            age: profile?.age,
            gender: profile?.gender || "",
            ageRange: ageRangeIds,
            relationship: relationshipIds,
            contactMethod: contactMethodIds,
            preferences: preferencesIds,
          });
    
          setOptions({
            ageRangeList: data.ageRanges.map((range: any) => ({ id: range.id, name: range.name })),
            relationshipList: data.relationships.map((rel: any) => ({ id: rel.id, name: rel.name })),
            contactMethodList: data.contactMethods.map((method: any) => ({ id: method.id, name: method.name })),
            preferencesList: data.preferences.map((pref: any) => ({ id: pref.id, name: pref.name })),
            genderList: data.genders.map((gen: any) => gen.name),
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
  

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const { value, checked } = e.target;
    const id = Number(value); 

    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name] as number[]), id]
        : (prev[name] as number[]).filter((item) => item !== id),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      body: JSON.stringify({
        email,
        age_range: formData.ageRange,
        relationship: formData.relationship,
        contact_methods: formData.contactMethod,
        preferences: formData.preferences,
        username: formData.username,
        bio: formData.bio,
        age: formData.age,
        gender: formData.gender,
      }),
    });
  
    if (response.ok) {
      toast.success("Profile updated successfully!");
    } else {
      const errorData = await response.json();
      toast.error(`Failed to update profile: ${errorData.message}`);
    }
  };

  const renderCheckboxGroup = (
    label: string,
    name: keyof FormData,
    selectedValues: number[],
    options: { id: number; name: string }[]
  ) => (
    <div className="mb-4">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="flex flex-col">
        {options.map((option) => (
          <label key={option.id} className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              name={name}
              value={option.id}
              checked={selectedValues.includes(option.id)} // Check if the option is selected
              onChange={(e) => handleCheckboxChange(e, name)} 
              className="form-checkbox text-indigo-600"
            />
            <span className="ml-2">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );


  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-full mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Gender</option>
            {options.genderList.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        {renderCheckboxGroup("Preferences", "preferences", formData.preferences, options.preferencesList)}
        {renderCheckboxGroup("Age Ranges", "ageRange", formData.ageRange, options.ageRangeList)}
        {renderCheckboxGroup("Relationships", "relationship", formData.relationship, options.relationshipList)}
        {renderCheckboxGroup("Contact Methods", "contactMethod", formData.contactMethod, options.contactMethodList)}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Update Profile
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ProfileEditForm;
