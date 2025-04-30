import React, { useState, useEffect, useRef } from 'react';

const SelectInput = ({ label, name, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    onChange(name, option.value);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div onClick={toggleDropdown} className="cursor-pointer p-2 border border-gray-300 rounded-md bg-white">
        {selectedLabel || 'Select an option'}
      </div>

      <div className={`absolute w-full bg-white border border-gray-300 rounded-md transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden z-10`}>
        {options.map((option, index) => (
          <div key={index} onClick={() => handleOptionClick(option)} className="px-4 py-2 cursor-pointer hover:bg-indigo-600 hover:text-white">
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectInput;
