
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileIcon}>
        <Ionicons
          name="person-circle"
          size={100}
          color="#287A4B"
        />
      </View>

      <Text style={styles.title}>Profil Pengguna</Text>
      <Text style={styles.subtitle}>
        Selamat datang di ThinkCook!
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nama Aplikasi</Text>
        <Text style={styles.value}>ThinkCook</Text>

        <Text style={styles.label}>Deskripsi</Text>
        <Text style={styles.value}>
          Aplikasi berbagi resep masakan.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  profileIcon: {
    alignItems: 'center',
    marginTop: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 20,
  },
});
