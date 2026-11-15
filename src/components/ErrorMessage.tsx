import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/styles';

export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={errorStyles.container}>
      <View style={errorStyles.iconCircle}>
        <Ionicons name="cloud-offline-outline" size={32} color={colors.primary} />
      </View>
      <Text style={errorStyles.title}>Gagal memuat</Text>
      <Text style={errorStyles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          style={({ pressed }) => [
            errorStyles.retryButton,
            pressed && errorStyles.pressed,
          ]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Coba lagi"
        >
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
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.bodySemi,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 6,
    maxWidth: 300,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 11,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    marginTop: spacing.xl,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bodyBold,
    marginLeft: 7,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
