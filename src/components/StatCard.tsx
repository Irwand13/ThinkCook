import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fonts, radius, spacing } from '../constants/styles';

type IoniconsName = keyof typeof Ionicons.glyphMap;

export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: IoniconsName;
  label: string;
  value: string;
}) {
  return (
    <View
      style={statStyles.card}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={statStyles.iconCircle}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>
      <Text style={statStyles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    ...cardShadow,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    color: colors.text,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 2,
  },
});
