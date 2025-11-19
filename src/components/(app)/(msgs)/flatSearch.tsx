import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';

export default function FlatSearchBar() {
  return (
    <View style={styles.container}>
      <Search size={18} color="#657786" strokeWidth={1.5} style={styles.icon} />
      <TextInput
        placeholder="Search for people and groups"
        placeholderTextColor="#657786"
        style={styles.input}
        returnKeyType="search"
        textAlignVertical="center"
        textAlign="left"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    backgroundColor: '#E7ECF0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CED5DC',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: '#657786',
    fontSize: 16,
    includeFontPadding: false,
  },
});
