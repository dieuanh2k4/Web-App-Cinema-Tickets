// src/components/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div
      style={{
        padding: '0 80px',
        marginTop: '30px',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          padding: '12px 25px',
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Search size={20} color="#666" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            marginLeft: '15px',
            fontSize: '15px',
            color: '#333',
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
