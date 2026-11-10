import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/styles';

export default function Loading({ message }: { message?: string }) {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={loadingStyles.text}>{message}</Text> : null}
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  text: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
  },
});
