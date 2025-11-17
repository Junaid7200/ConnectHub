import { Asset } from 'expo-asset';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

type FabProps = {
  onPress?: () => void;
};

export default function Fab({ onPress }: FabProps) {
  const featherUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/feather.svg')).uri,
    []
  );

  return (
    <Pressable style={styles.fab} onPress={onPress} hitSlop={8}>
      <View style={styles.iconWrapper}>
        <SvgUri uri={featherUri} width={28} height={28} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4C9EEB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
