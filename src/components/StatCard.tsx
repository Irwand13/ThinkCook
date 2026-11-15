import { StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fonts, radius, spacing } from '../constants/styles';

// Statistik tampil sebagai tipografi, bukan tile berikon: angka besar yang
// memimpin, label kecil di bawahnya. (Ikon dalam lingkaran warna di atas
// angka adalah pola template dashboard, bukan pola aplikasi resep.)
export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={statStyles.card}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
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
  value: {
    fontSize: 24,
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
