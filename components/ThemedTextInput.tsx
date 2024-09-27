import { type TextInputProps, StyleSheet, TextInput } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor = "#ffffff",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      style={[
        {
          color,
          borderColor: color
        },
        styles.input,
        style,
      ]}
      placeholder=''
      placeholderTextColor={color}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
});
