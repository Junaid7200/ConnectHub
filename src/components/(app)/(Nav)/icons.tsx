import { Settings, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';

const twitterBlue = '#4C9EEB';
const twitterBlueFaded = '#4C9EEB20'; // Blue with ~12% opacity for press-in bg

// "Gemini-like" icon for Home screen
export const HomeHeaderRight = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      className="mr-4 p-2 rounded-full"
      style={{ backgroundColor: isPressed ? twitterBlueFaded : 'transparent' }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Sparkles size={24} color={twitterBlue} />
    </Pressable>
  );
};

// Settings icon for other screens
export const SettingsHeaderRight = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      className="mr-4 p-2 rounded-full"
      style={{ backgroundColor: isPressed ? twitterBlueFaded : 'transparent' }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Settings
        size={24}
        color={twitterBlue}
        fill={isPressed ? twitterBlue : 'transparent'} // Fill on press
      />
    </Pressable>
  );
};