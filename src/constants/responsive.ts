import { useWindowDimensions } from 'react-native';

export const TABLET_BREAKPOINT = 600;
export const SMALL_PHONE_BREAKPOINT = 360;
export const CONTENT_MAX_WIDTH = 720;

export function useResponsive() {
  const { width } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;
  const isSmallPhone = width < SMALL_PHONE_BREAKPOINT;

  return {
    width,
    isTablet,
    isSmallPhone,
    columns: isTablet ? 2 : 1,
    maxContentWidth: CONTENT_MAX_WIDTH,
    heroHeight: isTablet ? 260 : 220,
    detailImageHeight: isTablet ? 340 : 300,
  };
}
