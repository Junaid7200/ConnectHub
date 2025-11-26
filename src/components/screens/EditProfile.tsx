// app/(app)/edit-profile.tsx
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAppSelector } from "@/src/hooks/useRedux";
import { uploadProfileAvatar, uploadProfileBanner } from "@/src/lib/storage";
import { supabase } from "@/src/lib/supabase";
import { Profile } from "@/src/types/types";

export default function EditProfile() {
  const router = useRouter();
  const { session } = useAppSelector((state) => state.auth);
  const userId = session?.id;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      setProfile(data as Profile);
      setDisplayName(data.display_name ?? "");
      setBio(data.bio ?? "");
      setLink(data.link ?? "");
      setLocation(data.location ?? "");
      setAvatarUrl(data.avatar_url ?? null);
      setBannerUrl(data.banner_url ?? null);
    };
    load();
  }, [userId]);

  const pickImage = async (
    onPicked: (
      file: Blob,
      extPathSetter: (path: string) => void
    ) => Promise<void>
  ) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      await onPicked(blob, (path) => {
        // immediate local state update to reflect the new storage path
        // you can also store publicUrl if you prefer to display that
        if (onPicked === handleAvatarUpload) setAvatarUrl(path);
        if (onPicked === handleBannerUpload) setBannerUrl(path);
      });
    }
  };

  const handleAvatarUpload = async (
    file: Blob,
    setPath: (path: string) => void
  ) => {
    if (!userId) return;
    const { path } = await uploadProfileAvatar(userId, file);
    setPath(path);
  };

  const handleBannerUpload = async (
    file: Blob,
    setPath: (path: string) => void
  ) => {
    if (!userId) return;
    const { path } = await uploadProfileBanner(userId, file);
    setPath(path);
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    const updates = {
      display_name: displayName || null,
      bio: bio || null,
      link: link || null,
      location: location || null,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    router.back();
  };

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text>Please log in.</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Banner</Text>
      <Pressable
        style={styles.banner}
        onPress={() =>
          pickImage((file) => handleBannerUpload(file, setBannerUrl))
        }
      >
        {bannerUrl ? (
          <Image
            source={{
              uri: supabase.storage.from("media").getPublicUrl(bannerUrl).data
                .publicUrl,
            }}
            style={styles.bannerImg}
          />
        ) : (
          <Text style={styles.placeholder}>Tap to add banner</Text>
        )}
      </Pressable>

      <Text style={styles.label}>Avatar</Text>
      <Pressable
        style={styles.avatar}
        onPress={() =>
          pickImage((file) => handleAvatarUpload(file, setAvatarUrl))
        }
      >
        {avatarUrl ? (
          <Image
            source={{
              uri: supabase.storage.from("media").getPublicUrl(avatarUrl).data
                .publicUrl,
            }}
            style={styles.avatarImg}
          />
        ) : (
          <Text style={styles.placeholder}>Tap to add avatar</Text>
        )}
      </Pressable>

      <Text style={styles.label}>Display name</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        placeholder="Display name"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Bio"
      />

      <Text style={styles.label}>Link</Text>
      <TextInput
        value={link}
        onChangeText={setLink}
        style={styles.input}
        placeholder="Link"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholder="Location"
      />

      <Pressable style={styles.save} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },
  label: { fontWeight: "600", fontSize: 14, color: "#0F1419" },
  input: {
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0F1419",
  },
  banner: {
    height: 140,
    backgroundColor: "#F2F4F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImg: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F2F4F5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { color: "#657786" },
  save: {
    marginTop: 8,
    backgroundColor: "#4C9EEB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
