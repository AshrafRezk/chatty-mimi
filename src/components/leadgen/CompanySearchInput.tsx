
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { searchCompanies } from '@/utils/companySearchUtils';
import { CompanySearchResult } from '@/types/leadGenAI';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2 } from 'lucide-react';

interface CompanySearchInputProps {
  label: string;
  value: string;
  onCompanySelect: (company: CompanySearchResult) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CompanySearchInput: React.FC<CompanySearchInputProps> = ({
  label,
  value,
  onCompanySelect,
  onChange,
  placeholder = "Enter company name",
  className = ""
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 500);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedSearchTerm.length < 3) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsSearching(true);
      
      // Set a timeout to cancel the search if it takes too long
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
        console.log('Search timed out');
      }, 5000);

      try {
        const results = await searchCompanies(debouncedSearchTerm);
        setSearchResults(results);
        setIsDropdownOpen(results.length > 0);
      } catch (error) {
        console.error('Error searching companies:', error);
      } finally {
        setIsSearching(false);
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = null;
        }
      }
    };

    handleSearch();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCompanyClick = (company: CompanySearchResult) => {
    onCompanySelect(company);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          id={label.replace(/\s+/g, '-').toLowerCase()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-8 ${className}`}
          autoComplete="off"
          onClick={() => {
            if (searchResults.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
        />
        {isSearching && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map((company, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-muted"
              onClick={() => handleCompanyClick(company)}
            >
              {company.favicon && (
                <img 
                  src={company.favicon} 
                  alt={`${company.name} logo`} 
                  className="w-4 h-4 mr-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div>
                <div className="font-medium">{company.name}</div>
                <div className="text-xs text-muted-foreground">{company.website}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanySearchInput;
