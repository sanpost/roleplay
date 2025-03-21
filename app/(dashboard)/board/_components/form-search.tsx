import { useState, useEffect } from 'react';
import Loader from './loader';

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
  onRandomUser: (user: any) => void; // Nowa funkcja do obsługi losowania użytkownika
}

export default function SearchForm({ onSearch, onRandomUser }: SearchFormProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<number[]>([]);
  const [selectedRelationships, setSelectedRelationships] = useState<number[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<number[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<Preference[]>([]);
  const [availableRelationships, setAvailableRelationships] = useState<Relationship[]>([]);
  const [availableAgeRanges, setAvailableAgeRanges] = useState<AgeRange[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true); // Dodajemy stan isLoading

  // Fetch options from the API
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

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
      } finally {
        setIsLoading(false); // Ustawiamy isLoading na false po zakończeniu pobierania
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

  const handleRandomUser = async () => {
    try {
      const response = await fetch('/api/users/random-user', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch random user');
      }

      const randomUser = await response.json();
      onRandomUser(randomUser); // Przekazujemy wylosowanego użytkownika do parenta
    } catch (error) {
      console.error('Error fetching random user:', error);
    }
  };

  if (isLoading) {
    // Wyświetlamy loader podczas ładowania danych
    return <Loader />;
  }
  
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

      <div className="flex justify-between mt-4">
        <button
          onClick={handleSearch}
          className="text-sm w-1/2 px-4 py-2 rounded bg-orange-950/90 text-white transition duration-300 items-center mr-2 hover:bg-orange-950/95"
        >
          🚀 Let&apos;s go 🚀  {/* Zmiana z ' na &apos; */}
        </button>

        {/* Random User Button */}
        <button
          onClick={handleRandomUser}
          className="text-sm w-1/2 px-4 py-2 rounded bg-orange-950/70  text-white transition duration-300 items-center ml-2 hover:bg-orange-950/75"
        >
          ✨ Get Random User ✨
        </button>
      </div>
    </div>
  );
}
