import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../constants/styles';

export function SkeletonBlock({
  width,
  height,
  style,
}: {
  width?: number | string;
  height: number;
  style?: object;
}) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessible={false}
      style={[
        skeletonStyles.block,
        { width: width ?? '100%', height, opacity },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <SkeletonBlock height={170} style={skeletonStyles.imageBlock} />
      <View style={skeletonStyles.cardBody}>
        <SkeletonBlock width="72%" height={18} />
        <SkeletonBlock width="38%" height={24} style={{ marginTop: spacing.md, borderRadius: radius.pill }} />
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={skeletonStyles.listWrap}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View>
      <SkeletonBlock width="45%" height={20} style={{ marginTop: spacing.md }} />
      <View style={[skeletonStyles.card, { marginTop: spacing.md }]}>
        <SkeletonBlock height={210} style={skeletonStyles.imageBlock} />
      </View>
      <SkeletonBlock width="30%" height={18} style={{ marginTop: spacing.lg }} />
      <View style={skeletonStyles.chipRow}>
        <SkeletonBlock width={84} height={36} style={{ borderRadius: radius.pill }} />
        <SkeletonBlock width={70} height={36} style={{ borderRadius: radius.pill }} />
        <SkeletonBlock width={92} height={36} style={{ borderRadius: radius.pill }} />
        <SkeletonBlock width={64} height={36} style={{ borderRadius: radius.pill }} />
      </View>
      <SkeletonBlock width="50%" height={20} style={{ marginTop: spacing.lg }} />
      <SkeletonBlock width="65%" height={14} style={{ marginTop: spacing.sm }} />
      <View style={{ marginTop: spacing.md }}>
        <CardSkeleton />
      </View>
    </View>
  );
}

export function DetailSkeleton() {
  return (
    <View style={skeletonStyles.detailWrap}>
      <SkeletonBlock height={280} style={skeletonStyles.imageBlock} />
      <View style={skeletonStyles.detailBody}>
        <SkeletonBlock width="80%" height={28} />
        <SkeletonBlock width="55%" height={28} style={{ marginTop: spacing.sm }} />
        <View style={skeletonStyles.chipRow}>
          <SkeletonBlock width={86} height={28} style={{ borderRadius: radius.pill }} />
          <SkeletonBlock width={72} height={28} style={{ borderRadius: radius.pill }} />
          <SkeletonBlock width={64} height={28} style={{ borderRadius: radius.pill }} />
        </View>
        <SkeletonBlock width="100%" height={120} style={{ marginTop: spacing.xl, borderRadius: radius.lg }} />
        <SkeletonBlock width="40%" height={20} style={{ marginTop: spacing.xxl }} />
        <SkeletonBlock width="100%" height={16} style={{ marginTop: spacing.md }} />
        <SkeletonBlock width="100%" height={16} style={{ marginTop: spacing.md }} />
        <SkeletonBlock width="100%" height={16} style={{ marginTop: spacing.md }} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  block: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imageBlock: {
    borderRadius: 0,
  },
  cardBody: {
    padding: 15,
  },
  listWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  detailWrap: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailBody: {
    padding: spacing.xl,
  },
});
