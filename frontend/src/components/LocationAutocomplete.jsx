import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LocationAutocomplete = ({ value, onChange, label, placeholder, required }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Sync prop value
  useEffect(() => {
    if (value !== searchTerm && !isOpen) {
      setSearchTerm(value);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && isOpen && searchTerm !== value) {
        fetchLocations(searchTerm);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  const fetchLocations = async (query) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9', // Prefer English names
        }
      });
      const data = await res.json();
      
      // Clean up the display name for a cleaner UI
      const formatted = data.map(item => {
        const addr = item.address;
        const city = addr.city || addr.town || addr.village || addr.county || item.name;
        const state = addr.state || '';
        const country = addr.country || '';
        return {
          ...item,
          displayName: [city, state, country].filter(Boolean).join(', ')
        };
      });

      // Remove exact duplicates by display name
      const unique = Array.from(new Map(formatted.map(item => [item.displayName, item])).values());
      
      setSuggestions(unique);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item) => {
    setSearchTerm(item.displayName);
    onChange(item.displayName);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    if (!e.target.value) {
      setSuggestions([]);
      onChange(''); // clear form state
    }
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
          <MapPin size={20} />
        </div>
        <input
          type="text"
          className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (searchTerm.length > 0) && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-float overflow-hidden max-h-60 overflow-y-auto"
          >
            {isLoading && suggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-muted flex items-center justify-center">
                Searching...
              </div>
            ) : (
              <ul className="py-2">
                {suggestions.map((item, index) => (
                  <li
                    key={item.place_id || index}
                    className="px-4 py-2 hover:bg-background-secondary cursor-pointer transition-colors flex items-start gap-3"
                    onClick={() => handleSelect(item)}
                  >
                    <MapPin size={16} className="text-text-muted mt-1 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-primary">{item.displayName.split(',')[0]}</div>
                      <div className="text-xs text-text-secondary">{item.displayName.split(',').slice(1).join(',')}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
