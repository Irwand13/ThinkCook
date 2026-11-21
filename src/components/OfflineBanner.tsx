import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../constants/styles';
import { useConnection } from '../hooks/useConnection';

export default function OfflineBanner() {
  const { offline } = useConnection();
  if (!offline) {
    return null;
  }
  return (
    <SafeAreaView
      edges={['top']}
      style={bannerStyles.safe}
      accessibilityRole="alert"
    >
      <View style={bannerStyles.bar}>
        <Ionicons name="cloud-offline-outline" size={16} color={colors.white} />
        <Text style={bannerStyles.text}>
          Kamu sedang offline — menampilkan resep tersimpan.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const bannerStyles = StyleSheet.create({
  safe: {
    backgroundColor: colors.primaryDark,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.white,
    marginLeft: 6,
  },
});
