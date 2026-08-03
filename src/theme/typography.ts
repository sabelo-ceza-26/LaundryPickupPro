import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 34,
    fontWeight: '700',
  } as TextStyle,
  title: {
    fontSize: 26,
    fontWeight: '700',
  } as TextStyle,
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  } as TextStyle,
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '400',
  } as TextStyle,
  label: {
    fontSize: 13,
    fontWeight: '600',
  } as TextStyle,
  button: {
    fontSize: 17,
    fontWeight: '700',
  } as TextStyle,
} as const;
