import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type Props = TextInputProps & {
  label: string;
  error?: string;
  secure?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function Input({
  label,
  error,
  secure = false,
  icon,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={focused ? colors.accent : colors.textFaint}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={hidden}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden(!hidden)}>
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textStrong,
    marginBottom: 8,
  },
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#C3D1CF',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  fieldFocused: {
    borderColor: colors.accent,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  toggle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 6,
  },
});
