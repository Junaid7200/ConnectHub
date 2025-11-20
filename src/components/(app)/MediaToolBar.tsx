import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mediaThumbs = [
  require('@/assets/images/project_images/MediaToolBar/Media.png'),
  require('@/assets/images/project_images/MediaToolBar/Media(1).png'),
  require('@/assets/images/project_images/MediaToolBar/Media(2).png'),
  require('@/assets/images/project_images/MediaToolBar/Media(3).png'),
];

const icons = {
  image: require('@/assets/images/project_images/MediaToolBar/Image.svg'),
  gif: require('@/assets/images/project_images/MediaToolBar/Gif.svg'),
  stats: require('@/assets/images/project_images/MediaToolBar/Stats.svg'),
  location: require('@/assets/images/project_images/MediaToolBar/Loaction.svg'),
  circle: require('@/assets/images/project_images/MediaToolBar/Circle.svg'),
  add: require('@/assets/images/project_images/MediaToolBar/Add_Button.svg'),
  camera: require('@/assets/images/project_images/MediaToolBar/Camera.svg'),
  vertical: require('@/assets/images/project_images/MediaToolBar/Vertical_Sperator.svg'),
};

const uri = (mod: number) => Asset.fromModule(mod).uri;

export default function MediaToolBar() {
  const [visible, setVisible] = useState(false);
  const [kbHeight, setKbHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const maxKeyboardHeight = Dimensions.get('window').height * 0.7;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      const height = e?.endCoordinates?.height ?? 0;
      const clamped = Math.max(0, Math.min(height, maxKeyboardHeight) - insets.bottom);
      setKbHeight(clamped);
      setVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setVisible(false);
      setKbHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!visible) return null;

  return (
    <View style={[styles.wrapper, { bottom: kbHeight }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
        <View style={styles.cameraThumb}>
          <SvgUri uri={uri(icons.camera)} width={28} height={28} />
        </View>
        {mediaThumbs.map((src, idx) => (
          <Image key={idx} source={src} style={styles.mediaThumb} />
        ))}
      </ScrollView>

      <View style={styles.toolbar}>
        <SvgUri uri={uri(icons.image)} width={24} height={24} />
        <SvgUri uri={uri(icons.gif)} width={32} height={24} />
        <SvgUri uri={uri(icons.stats)} width={24} height={24} />
        <SvgUri uri={uri(icons.location)} width={24} height={24} />
        <View style={styles.actionsRight}>
          <SvgUri uri={uri(icons.circle)} width={24} height={24} />
          <SvgUri uri={uri(icons.vertical)} width={1} height={24} />
          <SvgUri uri={uri(icons.add)} width={28} height={28} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#CED5DC',
    paddingBottom: 8,
  },
  mediaRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cameraThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  mediaThumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 18,
    marginRight: 0,
  },
});
