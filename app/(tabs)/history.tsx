import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import CheckBox from 'react-native-bouncy-checkbox';

import type { Customer, Payment, Sell, SellProduct } from '@/hooks/useDb';

function Payment({ payment }: { payment: Payment }) {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText>fecha: {payment.createdAt}</ThemedText>
      <ThemedText>methodo de pago {payment.payment_method}</ThemedText>
      <ThemedText>moneda: {payment.currency === 'bolivares' ? payment.currency : 'dolares'}</ThemedText>
      <ThemedText>monto pagado: {payment.currency === 'bolivares' ? (payment.amount_paid / 1000 * 37) : (payment.amount_paid / 1000)}</ThemedText>
      <ThemedText>customer_id: {payment.customer_id}</ThemedText>
    </ThemedView>
  );
}

export default function Customers() {
  const db = useSQLiteContext();
  const [registeredPayments, setRegisteredPayments] = useState<Payment[]>([])
  const [registeredSell, setRegisteredSell] = useState<Customer[]>([])
  const [filterByPayment, setFilterByPayment] = useState(false);

  async function getData() {
    const sells = await db.getAllAsync<Sell>('SELECT * FROM sells');
    const payments = await db.getAllAsync<Payment>('SELECT * FROM payments');
    console.log("sells", sells);
    const test = await db.getAllAsync<SellProduct>('SELECT * FROM sells_products WHERE sell_id=?', sells[0].id);
    console.log("testing query", test);
    setRegisteredPayments(payments);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Historial</ThemedText>
      </ThemedView>

      <ThemedView style={{ marginTop: 20 }}>
        <ThemedText type='subtitle'>
          Filtros
        </ThemedText>

        <ThemedView style={{ flexDirection: 'row', marginTop: 10 }}>
          <CheckBox
            isChecked={!filterByPayment}
            useBuiltInState={false}
            onPress={(newValue) => {
              setFilterByPayment(newValue)
            }}
          />
          <ThemedText type='default'>
            Ventas
          </ThemedText>
        </ThemedView >

        <ThemedView style={{ flexDirection: 'row' }}>
          <CheckBox
            useBuiltInState={false}
            isChecked={filterByPayment}
            onPress={(newValue) => {
              setFilterByPayment(!newValue)
            }}
          />
          <ThemedText type='default'>
            Pagos
          </ThemedText>
        </ThemedView >
      </ThemedView >

      <ThemedView style={{ marginTop: 30 }}>
      </ThemedView >

      {filterByPayment && registeredPayments.length === 0 && (
        <ThemedText type="defaultSemiBold">No hay pagos registrados</ThemedText>
      )}

      {!filterByPayment && registeredSell.length === 0 && (
        <ThemedText type="defaultSemiBold">No hay ventas registradas</ThemedText>
      )}

      {filterByPayment && registeredPayments.map((payment) => (
        <Payment key={payment.id} payment={payment} />
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
    gap: 4,
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
