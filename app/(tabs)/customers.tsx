import { StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import type { Customer } from '@/hooks/useDb';

function Customer({ customer }: { customer: Customer }) {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText>{customer.id}: {customer.name}</ThemedText>
    </ThemedView>
  );
}

export default function Customers() {
  const db = useSQLiteContext();
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

  async function getData() {
    const data = await db.getAllAsync<Customer>('SELECT * FROM customers');
    setCustomers(data.slice(1));
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Clientes</ThemedText>
      </ThemedView>
      {customers.length === 0 && (
        <ThemedText type="defaultSemiBold">No hay clientes registrados</ThemedText>
      )}
      {customers.map((customer) => (
        <Customer key={customer.id} customer={customer} />
      ))}
      {showModal ? (
        <ThemedView style={{ marginTop: 10 }}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder='Nombre'
          />
          <Button
            label='añadir'
            variant='primary'
            onPress={async () => {
              await db.runAsync('INSERT INTO customers (name) VALUES (?)', name);
              setName('');
              await getData();
              setShowModal(false)
            }}
          />
        </ThemedView >
      ) : (
        <ThemedView style={{ marginTop: 10 }}>
          <Button
            label='añadir cliente'
            variant='primary'
            onPress={() => setShowModal(true)}
          />
        </ThemedView >
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
