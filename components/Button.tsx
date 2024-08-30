import { StyleSheet, View, Pressable, GestureResponderEvent } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type ButtonProps = {
  label: string,
  variant?: 'primary' | string,
  lightColor?: string;
  darkColor?: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined,
}

export default function Button({ label, variant, lightColor, darkColor, onPress }: ButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor || "#717BB3", dark: darkColor || "#fff" }, 'background');

  if (variant === 'primary') {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable
          style={[{ backgroundColor }, styles.button]}
          onPress={onPress}
        >
          <ThemedText style={[styles.buttonLabel]} >{label}</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <ThemedText style={styles.buttonLabel}>
          {label}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 18,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#0000',
    borderStyle: 'solid',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
