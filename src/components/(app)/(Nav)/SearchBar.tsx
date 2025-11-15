import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchHeader() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
      style={[
        styles.container, 
        { borderColor: isFocused ? "#1DA1F2" : "#E1E8ED" }
      ]}
    >
      <Search 
        size={18} 
        color={isFocused ? "#1DA1F2" : "#657786"} 
        strokeWidth={2}
      />
      <TextInput
        placeholder="Search Twitter"
        placeholderTextColor="#657786"
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 32, // Changed to 32 to match Figma
    backgroundColor: "#F7F9FA",
    borderRadius: 16, // Half of height for perfect pill shape
    paddingHorizontal: 12,
    borderWidth: 2,
    width: "100%", // Take full width of container
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#14171A",
    fontSize: 15,
    height: "100%",
  },
});