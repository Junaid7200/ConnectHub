import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function SearchHeader() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { borderColor: isFocused ? '#1DA1F2' : '#E1E8ED' },
        ]}
      >
        <Search
          size={16}
          color={isFocused ? '#1DA1F2' : '#687684'}
          strokeWidth={1.7}
          style={styles.icon}
        />
        <TextInput
          placeholder="Search Twitter"
          placeholderTextColor="#687684"
          style={styles.input}
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
    justifyContent: 'center',
    height: 32,
    width: 286,
    backgroundColor: '#E7ECF0',
    borderRadius: 16,
    paddingHorizontal: 0, // center icon + text as a block
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 0,
    width: 200,
    paddingLeft: 0,
    paddingRight: 0,
    height: '100%', // fill the 32px container
    paddingTop: 0,
    paddingBottom: 0,
    color: '#687684',
    fontSize: 17,
    letterSpacing: -0.3,
    textAlignVertical: 'center',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
