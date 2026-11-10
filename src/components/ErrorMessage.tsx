import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/styles';

/**
 * COMPONENT: ErrorMessage
 * Ditampilkan saat Promise dari API berstatus "rejected" (gagal):
 * jaringan mati, server error, atau timeout. Tombol "Coba Lagi"
 * memanggil prop onRetry untuk mengulang proses async dari awal —
 * pola standar penanganan error pada pemanggilan API.
 */
export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={errorStyles.container}>
      <Ionicons name="alert-circle-outline" size={52} color={colors.primary} />
      <Text style={errorStyles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={errorStyles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={17} color={colors.white} />
          <Text style={errorStyles.retryText}>Coba Lagi</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 28,
  },
  message: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bodyBold,
    marginLeft: 7,
  },
});
