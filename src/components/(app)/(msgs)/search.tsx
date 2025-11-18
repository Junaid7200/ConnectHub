import React from 'react';

import SearchBar from '@/src/components/SearchBar';

export default function MessagesSearchBar() {
  return (
    <SearchBar
      placeholder="Search for people and groups"
      width={382}
      align="left"
      backgroundColor="#E7ECF0"
      showFocusBorder={false}
      style={{ paddingHorizontal: 14, paddingVertical: 10 }}
    />
  );
}
