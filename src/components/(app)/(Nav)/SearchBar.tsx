import React from 'react';

import SearchBar from '@/src/components/SearchBar';

export default function SearchHeader() {
  return (
    <SearchBar
      placeholder="Search Twitter"
      width={286}
      align="center"
      backgroundColor="#E7ECF0"
      showFocusBorder
    />
  );
}
