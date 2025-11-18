import React, { useState } from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';

import { SearchBarProps } from '@/src/types/types';

export default function SearchBar({
  placeholder,
  width = 286,
  align = 'center',
  backgroundColor = '#E7ECF0',
  showFocusBorder = true,
  style,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const container: ViewStyle = {
    width,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
    backgroundColor,
    borderColor: showFocusBorder ? (isFocused ? '#1DA1F2' : '#E1E8ED') : 'transparent',
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.container, container]}>
        <Search
          size={16}
          color={isFocused ? '#1DA1F2' : '#687684'}
          strokeWidth={1.7}
          style={[styles.icon, align === 'center' ? styles.iconCenter : styles.iconLeft]}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#687684"
          style={[styles.input, align === 'center' ? styles.inputCenter : styles.inputLeft]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          textAlignVertical="center"
          textAlign="left"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  iconCenter: {
    marginLeft: 0,
  },
  iconLeft: {
    marginLeft: 10,
  },
  input: {
    flexShrink: 1,
    minWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    height: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    color: '#687684',
    fontSize: 17,
    letterSpacing: -0.3,
    textAlignVertical: 'center',
    includeFontPadding: false,
    textAlign: 'left',
  },
  inputCenter: {
    flexBasis: 'auto',
  },
  inputLeft: {
    flex: 1,
  },
});
