import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const rows = 20;

  // Fetch cities function
  const fetchCities = useCallback(
    async (reset = false) => {
      if (loading || !hasMore) return;
      setLoading(true);

      const baseUrl = 'https://public.opendatasoft.com/api/records/1.0/search/';
      const params = {
        dataset: 'geonames-all-cities-with-a-population-1000',
        rows,
        start: reset ? 0 : start,
        q: searchQuery,
        sort: sortOrder === 'asc' ? sortField : `-${sortField}`,
        facet: ['country', 'timezone'],
      };

      try {
        const response = await axios.get(baseUrl, { params });
        const newCities = response.data.records;

        setCities((prevCities) => (reset ? newCities : [...prevCities, ...newCities]));
        setStart((prevStart) => prevStart + rows);
        setHasMore(newCities.length === rows);
      } catch (error) {
        console.error('Error fetching city details:', error);
      } finally {
        setLoading(false);
      }
    },
    [start, searchQuery, sortField, sortOrder, loading, hasMore]
  );

  // Load initial cities and handle search/sort changes
  useEffect(() => {
    setCities([]);
    setStart(0);
    setHasMore(true);
    fetchCities(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortField, sortOrder]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        fetchCities();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchCities]);

  // Debounced search input handler
  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  // Sort handler
  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search cities..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Cities Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>City Name</th>
            <th onClick={() => handleSort('country')}>Country</th>
            <th onClick={() => handleSort('timezone')}>Timezone</th>
            <th onClick={() => handleSort('population')}>Population</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.recordid}>
              <td>
                <Link
                  to={`/city/${city.fields.geoname_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {city.fields.name}
                </Link>
              </td>
              <td>{city.fields.country}</td>
              <td>{city.fields.timezone}</td>
              <td>{city.fields.population}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loading Indicator */}
      {loading && <p>Loading more cities...</p>}
      {!hasMore && <p>No more cities to load.</p>}
    </div>
  );
};

export default CitiesTable;
