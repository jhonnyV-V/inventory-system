import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

type Customer = {
  id: number
  name: string
}

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

  useEffect(() => {
    async function getData() {
      const data = await db.getAllAsync<Customer>('SELECT * FROM customers');
      setCustomers(data);
    }
    getData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>
      {customers.map((customer) => (
        <Customer key={customer.id} customer={customer} />
      ))}
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
});
