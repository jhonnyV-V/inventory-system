import { StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';


type modalType = 'sell' | 'payment' | 'none'
type Props = {
  setModal: React.Dispatch<
    React.SetStateAction<modalType>
  >,
};

function Sell({ setModal }: Props) {

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Registrar Venta</ThemedText>
      </ThemedView>
      <ThemedView style={{ marginTop: 10 }}>
        <Button
          label='registar venta'
          variant='primary'
          onPress={() => setModal('none')}
        />
      </ThemedView >

    </>
  );
}

function Payment({ setModal }: Props) {

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Registrar Pago</ThemedText>
      </ThemedView>
      <ThemedView style={{ marginTop: 10 }}>
        <Button
          label='registar pago'
          variant='primary'
          onPress={() => setModal('none')}
        />
      </ThemedView >
    </>
  );
}

export default function Home() {
  const db = useSQLiteContext();
  const [showModal, setShowModal] = useState<modalType>('none');

  return (
    <ThemedView style={styles.container}>
      {showModal === 'none' && (
        <ThemedView style={{ marginTop: 10, gap: 10 }}>
          <Button
            label='registrar venta'
            variant='primary'
            onPress={() => setShowModal('sell')}
          />
          <Button
            label='registar pago'
            variant='primary'
            onPress={() => setShowModal('payment')}
          />
        </ThemedView >
      )}

      {showModal === 'sell' && (
        <Sell setModal={setShowModal} />
      )}

      {showModal === 'payment' && (
        <Payment setModal={setShowModal} />
      )}

    </ThemedView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
});
