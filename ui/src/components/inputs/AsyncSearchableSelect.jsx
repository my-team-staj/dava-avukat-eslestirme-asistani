// ui/src/components/inputs/AsyncSearchableSelect.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Portal from './Portal';
import axios from 'axios';
import '../../App.css';

export default function AsyncSearchableSelect({
  dataSource,
  value = null,
  onChange,
  placeholder = 'Seçin...',
  disabled = false,
  required = false,
  className = '',
  'aria-label': ariaLabel,
  debounceMs = 250
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState({ left: 0, top: 0, width: 0, below: true });
  
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef();

  // Find selected option
  const selectedOption = options.find(opt => opt.value === value);

  const updateCoords = useCallback(() => {
    const el = selectRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const below = rect.bottom + 300 < vh; // 300px estimated dropdown height
    setCoords({ 
      left: rect.left, 
      top: below ? rect.bottom : rect.top, 
      width: rect.width, 
      below 
    });
  }, []);

  // Fetch options from API
  const fetchOptions = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL(dataSource.endpoint, window.location.origin);
      if (search && dataSource.searchParam) {
        url.searchParams.set(dataSource.searchParam, search);
      }
      
      const response = await axios.get(url.toString());
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      
      const mappedOptions = data.map((item) => ({
        value: item[dataSource.valueField],
        label: item[dataSource.labelField] || `#${item[dataSource.valueField]}`,
        data: item
      }));
      
      setOptions(mappedOptions);
    } catch (err) {
      setError('Veri yüklenirken hata oluştu');
      console.error('AsyncSearchableSelect fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [dataSource]);

  // Debounced search
  const debouncedSearch = useCallback((search) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      fetchOptions(search);
    }, debounceMs);
  }, [fetchOptions, debounceMs]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);
    debouncedSearch(newSearch);
  };

  // Handle option selection
  const handleSelect = (option) => {
    onChange?.(option.value, option.data);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle dropdown open/close
  const handleToggle = () => {
    if (disabled) return;
    
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    
    if (newOpen) {
      updateCoords();
      // Load initial data if not loaded
      if (options.length === 0) {
        fetchOptions();
      }
      // Focus search input after opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setSearchTerm('');
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && !isOpen) {
      e.preventDefault();
      handleToggle();
    }
  };

  // Handle retry
  const handleRetry = () => {
    fetchOptions(searchTerm);
  };

  // Update coords when opened
  useEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleResize = () => updateCoords();
      const handleScroll = () => updateCoords();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, updateCoords]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`async-select-root ${className}`} ref={selectRef}>
      <button
        type="button"
        className={`async-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-required={required}
      >
        <span className={`async-select-value ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption?.label || placeholder}
        </span>
        <span className="async-select-caret">▼</span>
      </button>

      {isOpen && (
        <Portal>
          <div
            className="async-select-dropdown"
            style={{
              position: 'fixed',
              zIndex: 10000,
              left: coords.left,
              top: coords.below ? coords.top : undefined,
              bottom: coords.below ? undefined : (window.innerHeight - coords.top),
              width: coords.width,
              minWidth: 200
            }}
            role="listbox"
            aria-label={`${ariaLabel || placeholder} seçenekleri`}
          >
            <div className="async-select-search">
              <input
                ref={searchInputRef}
                type="text"
                className="async-select-search-input"
                placeholder="Ara..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                aria-label="Arama"
              />
            </div>

            <div className="async-select-options">
              {loading && (
                <div className="async-select-loading">
                  <div className="spinner-sm"></div>
                  <span>Yükleniyor...</span>
                </div>
              )}

              {error && (
                <div className="async-select-error">
                  <span>{error}</span>
                  <button 
                    type="button" 
                    className="retry-btn"
                    onClick={handleRetry}
                  >
                    Tekrar Dene
                  </button>
                </div>
              )}

              {!loading && !error && options.length === 0 && (
                <div className="async-select-empty">
                  Sonuç bulunamadı
                </div>
              )}

              {!loading && !error && options.length > 0 && (
                <>
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`async-select-option ${option.value === value ? 'selected' : ''}`}
                      onClick={() => handleSelect(option)}
                      role="option"
                      aria-selected={option.value === value}
                    >
                      {option.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
