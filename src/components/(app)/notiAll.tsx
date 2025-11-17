import { Asset } from 'expo-asset';
import { ChevronDown } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

type NotiAllProps = {
  avatar: any; // require(...) asset
  title: string;
  body: string;
  link?: string;
};

export default function NotiAll({ avatar, title, body, link }: NotiAllProps) {
  const sparkUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/notiAll_icon.svg')).uri,
    []
  );

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SvgUri uri={sparkUri} width={24} height={24} style={styles.spark} />

        <View style={styles.contentColumn}>
          <View style={styles.headerRow}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.chevronWrapper}>
              <ChevronDown size={16} color="#657786" />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          {link ? <Text style={styles.link}>{link}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spark: {
    marginRight: 14,
    marginTop: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  chevronWrapper: {
    marginLeft: 'auto',
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#0F1419',
    marginBottom: 6,
  },
  body: {
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 22,
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: '#4C9EEB',
  },
});
