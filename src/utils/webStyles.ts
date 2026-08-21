import { Platform, ViewStyle } from 'react-native';

export const isWeb = Platform.OS === 'web';

/** Narrow content container (forms, auth, single-column) */
export const webContainer: ViewStyle = isWeb
  ? {
      alignSelf: 'center',
      width: '100%',
      maxWidth: 480,
      paddingHorizontal: 24,
    }
  : {};

/** Medium content container (order details, settings, profiles) */
export const webMediumContainer: ViewStyle = isWeb
  ? {
      alignSelf: 'center',
      width: '100%',
      maxWidth: 600,
      paddingHorizontal: 24,
    }
  : {};

/** Wide content container (dashboards, lists, tables) */
export const webWideContainer: ViewStyle = isWeb
  ? {
      alignSelf: 'center',
      width: '100%',
      maxWidth: 720,
      paddingHorizontal: 24,
    }
  : {};

/** Extra-wide content container (reports, large dashboards) */
export const webExtraWideContainer: ViewStyle = isWeb
  ? {
      alignSelf: 'center',
      width: '100%',
      maxWidth: 900,
      paddingHorizontal: 24,
    }
  : {};

/** Full-width fill */
export const webFullWidth: ViewStyle = isWeb
  ? {
      width: '100%',
    }
  : {};

/** Centered card (modals, forms, auth cards) */
export const webCard: ViewStyle = isWeb
  ? {
      maxWidth: 480,
      alignSelf: 'center',
      width: '100%',
    }
  : {};

/** Flex center alignment */
export const webCentered: ViewStyle = isWeb
  ? {
      alignItems: 'center',
      justifyContent: 'center',
    }
  : {};

/** Full screen center */
export const webScreenCenter: ViewStyle = isWeb
  ? {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    }
  : {};

/** Web scrollable area with max width */
export const webScrollContent: ViewStyle = isWeb
  ? {
      alignItems: 'center',
    }
  : {};

/** Grid row for web (wraps cards side-by-side) */
export const webGridRow: ViewStyle = isWeb
  ? {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }
  : {};

/** Grid card for web (used with webGridRow) */
export const webGridCard: ViewStyle = isWeb
  ? {
      width: '48%',
      marginBottom: 14,
    }
  : {};

/** Adds cursor pointer on web for touchable elements */
export const webCursorPointer: ViewStyle = isWeb
  ? {
      cursor: 'pointer' as any,
    }
  : {};
