import { useState, useEffect } from 'react';

interface SearchFormProps {
  onSearch: (searchData: any) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<string[]>([]);
  const [availableRelationships, setAvailableRelationships] = useState<string[]>([]);
  const [availableAgeRanges, setAvailableAgeRanges] = useState<string[]>([]);

  // Fetch options from the API
  useEffect(() => {
    async function fetchData() {
      try {
        const [prefsRes, relRes, ageRes] = await Promise.all([
          fetch('/api/preferences'),
          fetch('/api/relationships'),
          fetch('/api/age-ranges'),
        ]);

        const preferencesData = await prefsRes.json();
        const relationshipsData = await relRes.json();
        const ageRangesData = await ageRes.json();

        setAvailablePreferences(preferencesData);
        setAvailableRelationships(relationshipsData);
        setAvailableAgeRanges(ageRangesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Toggle preferences selection
  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  // Toggle relationships selection
  const toggleRelationship = (relationship: string) => {
    setSelectedRelationships((prev) =>
      prev.includes(relationship)
        ? prev.filter((r) => r !== relationship)
        : [...prev, relationship]
    );
  };

  // Toggle age ranges selection
  const toggleAgeRange = (ageRange: string) => {
    setSelectedAgeRanges((prev) =>
      prev.includes(ageRange)
        ? prev.filter((a) => a !== ageRange)
        : [...prev, ageRange]
    );
  };

  const handleSearch = () => {
    console.log("Selected Preferences:", selectedPreferences);
    console.log("Selected Relationships:", selectedRelationships);
    console.log("Selected Age Ranges:", selectedAgeRanges);
  
    onSearch({
      preferences: selectedPreferences,
      relationships: selectedRelationships, // Używaj poprawnej zmiennej
      ageRanges: selectedAgeRanges, // Używaj poprawnej zmiennej
    });
  };
  

  return (
    <div className="p-4">
      {/* Preferences Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <div className="flex flex-wrap">
          {availablePreferences.map((pref) => (
            <button
              key={pref}
              onClick={() => togglePreference(pref)}
              className={`text-sm m-1 px-4 py-2 rounded text-white ${
                selectedPreferences.includes(pref) ? 'bg-[#462B20]' : 'bg-[#714733]'
              } transition duration-300`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Relationship</h3>
        <div className="flex flex-wrap">
          {availableRelationships.map((rel) => (
            <button
              key={rel}
              onClick={() => toggleRelationship(rel)}
              className={`text-sm m-1 px-4 py-2 rounded text-white ${
                selectedRelationships.includes(rel) ? 'bg-[#543327]' : 'bg-[#8D563F]'
              } transition duration-300`}
            >
              {rel}
            </button>
          ))}
        </div>
      </div>

      {/* Age Range Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Age Range</h3>
        <div className="flex flex-wrap">
          {availableAgeRanges.map((ageRange) => (
            <button
              key={ageRange}
              onClick={() => toggleAgeRange(ageRange)}
              className={`text-sm m-1 px-4 py-2 rounded text-white ${
                selectedAgeRanges.includes(ageRange) ? 'bg-[#623B2D]' : 'bg-[#A9684C]'
              } transition duration-300`}
            >
              {ageRange}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="text-sm mt-4 w-full px-4 py-2 rounded bg-[#462B20] text-white transition duration-300 items-center"
      >
        Let's go
      </button>
    </div>
  );
}
