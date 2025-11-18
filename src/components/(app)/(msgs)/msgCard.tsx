import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Avatar from "@/src/components/(app)/(Nav)/avatar";
import { MessageCardProps } from "@/src/types/types";

export default function MsgCard({
  avatar,
  displayName,
  username,
  date,
  preview,
}: MessageCardProps) {
  return (
    <View style={styles.card}>
      <Avatar
        source={avatar}
        name={displayName}
        size={55}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.username}> @{username}</Text>
          <View style={styles.spacer} />
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.preview} numberOfLines={1} ellipsizeMode="tail">
          {preview}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E1E8ED",
  },
  avatar: {
    marginRight: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F1419",
  },
  username: {
    fontSize: 15,
    color: "#657786",
  },
  spacer: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#657786",
    marginLeft: 8,
  },
  preview: {
    marginTop: 2,
    fontSize: 15,
    color: "#657786",
  },
});
