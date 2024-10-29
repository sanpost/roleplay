import { useState, useEffect } from 'react';

interface Preference {
  id: number;
  name: string;
}

interface Relationship {
  id: number;
  name: string;
}

interface AgeRange {
  id: number;
  name: string;
}

interface SearchFormProps {
  onSearch: (searchData: any) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<number[]>([]);
  const [selectedRelationships, setSelectedRelationships] = useState<number[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<number[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<Preference[]>([]);
  const [availableRelationships, setAvailableRelationships] = useState<Relationship[]>([]);
  const [availableAgeRanges, setAvailableAgeRanges] = useState<AgeRange[]>([]);

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

  const togglePreference = (preferenceId: number) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId)
        ? prev.filter((id) => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const toggleRelationship = (relationshipId: number) => {
    setSelectedRelationships((prev) =>
      prev.includes(relationshipId)
        ? prev.filter((id) => id !== relationshipId)
        : [...prev, relationshipId]
    );
  };

  const toggleAgeRange = (ageRangeId: number) => {
    setSelectedAgeRanges((prev) =>
      prev.includes(ageRangeId)
        ? prev.filter((id) => id !== ageRangeId)
        : [...prev, ageRangeId]
    );
  };

  const handleSearch = () => {
    onSearch({
      preferences: selectedPreferences,
      relationships: selectedRelationships,
      ageRanges: selectedAgeRanges,
    });
  };
  
  return (
    <div className="px-4">
      {/* Preferences Selection */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-1">Preferences</h3>
        <div className="flex flex-wrap">
          {availablePreferences.map((pref) => (
            <button
              key={pref.id}
              onClick={() => togglePreference(pref.id)}
              className={`text-sm m-1 px-4 py-2 rounded text-white ${
                selectedPreferences.includes(pref.id) ? 'bg-[#462B20]' : 'bg-[#714733]'
              } transition duration-300`}
            >
              {pref.name}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Selection */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-1">Relationship</h3>
        <div className="flex flex-wrap">
          {availableRelationships.map((rel) => (
            <button
              key={rel.id}
              onClick={() => toggleRelationship(rel.id)}
              className={`text-sm m-1 px-4 py-2 rounded text-white ${
                selectedRelationships.includes(rel.id) ? 'bg-[#543327]' : 'bg-[#8D563F]'
              } transition duration-300`}
            >
              {rel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Age Range Selection */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-1">Age Range</h3>
        <div className="flex flex-wrap">
          {availableAgeRanges.map((ageRange) => (
            <button
              key={ageRange.id}
              onClick={() => toggleAgeRange(ageRange.id)}
              className={`text-sm m-1 px-4 py-2 rounded text-white ${
                selectedAgeRanges.includes(ageRange.id) ? 'bg-[#623B2D]' : 'bg-[#A9684C]'
              } transition duration-300`}
            >
              {ageRange.name}
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
