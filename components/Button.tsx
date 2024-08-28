import { StyleSheet, View, Pressable, GestureResponderEvent } from 'react-native';
import { ThemedText } from './ThemedText';

type ButtonProps = {
  label: string,
  theme: string,
  onPress: ((event: GestureResponderEvent) => void) | null | undefined,
}

export default function Button({ label, theme, onPress }: ButtonProps) {

  if (theme === 'primary') {
    return (
      <View>
        <Pressable
          onPress={onPress}
        >
          <ThemedText>{label}</ThemedText>
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
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
