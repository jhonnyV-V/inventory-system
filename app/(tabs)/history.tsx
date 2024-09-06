import { StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import CheckBox from 'react-native-bouncy-checkbox';

import type { Payment, Sell, SellProduct } from '@/hooks/useDb';
import { currencyToText, displayCurrency, displayPaymentMethod } from '@/utils/utils';
import { SafeAreaView } from 'react-native-safe-area-context';

type AgregatedSell = Sell & {
  products: (SellProduct & { name: string, value: number })[]
  name: string
}

type PopulatedPayment = Payment & {
  name: string
};

function Payment({ payment }: { payment: PopulatedPayment }) {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText>fecha: {payment.createdAt}</ThemedText>
      <ThemedText>methodo de pago: {displayPaymentMethod(payment.payment_method)}</ThemedText>
      <ThemedText>monto pagado: {displayCurrency(payment.amount_paid, payment.currency)} {currencyToText(payment.currency)}</ThemedText>
      <ThemedText>customer_id: {payment.customer_id}</ThemedText>
      <ThemedText>name: {payment.name}</ThemedText>
    </ThemedView>
  );
}

function Sell({ sell }: { sell: AgregatedSell }) {
  let totalCost = 0;
  for (const product of sell.products) {
    totalCost += product.value * product.units;
  }
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText>fecha: {sell.createdAt}</ThemedText>
      <ThemedText>methodo de pago: {displayPaymentMethod(sell.payment_method)}</ThemedText>
      <ThemedText>monto pagado: {displayCurrency(sell.amount_paid, sell.currency)} {currencyToText(sell.currency)}</ThemedText>
      <ThemedText>customer_id: {sell.customer_id}</ThemedText>
      <ThemedText>name: {sell.name}</ThemedText>
      <ThemedText type='defaultSemiBold'>productos vendidos</ThemedText>
      {sell.products.map((product) => (
        <ThemedText key={product.id}>{product.units} {product.name}/s por {
          displayCurrency(product.units * product.value, sell.currency)
        } {currencyToText(sell.currency)}</ThemedText>
      ))}
      <ThemedText>costo total en dolares: {displayCurrency(totalCost, 'dolars')} dolares</ThemedText>
      <ThemedText>costo total en bolivares: {displayCurrency(totalCost, 'bolivares')} bolivares</ThemedText>
    </ThemedView>
  );
}

export default function History() {
  const db = useSQLiteContext();
  const [registeredPayments, setRegisteredPayments] = useState<PopulatedPayment[]>([])
  const [registeredSell, setRegisteredSell] = useState<AgregatedSell[]>([])
  const [filterByPayment, setFilterByPayment] = useState(false);

  async function getData() {
    const sells = await db.getAllAsync<Sell & { name: string }>(
      `SELECT sells.*, customers.name FROM sells
        INNER JOIN customers ON sells.customer_id = customers.id`
    );
    const payments = await db.getAllAsync<PopulatedPayment>(
      `SELECT payments.*, customers.name FROM payments
        INNER JOIN customers ON payments.customer_id = customers.id`
    );
    console.log("payments", payments);
    console.log("sells", sells);
    const agregatedSells: AgregatedSell[] = [];
    for (const sell of sells) {
      const products = await db.getAllAsync<SellProduct & { name: string, value: number }>(
        `SELECT sells_products.*, products.name, products.value FROM sells_products
          INNER JOIN products ON sells_products.product_id = products.id
        WHERE sell_id=?`,
        sell.id,
      );
      agregatedSells.push({
        ...sell,
        products: products
      });

    }
    setRegisteredSell(agregatedSells);
    console.log('agregatedSells', agregatedSells);
    setRegisteredPayments(payments);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
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

            <ThemedView style={{ flexDirection: 'row', marginTop: 5 }}>
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
          {filterByPayment && registeredPayments.map((payment) => (
            <Payment key={payment.id} payment={payment} />
          ))}

          {!filterByPayment && registeredSell.length === 0 && (
            <ThemedText type="defaultSemiBold">No hay ventas registradas</ThemedText>
          )}
          {!filterByPayment && registeredSell.map((sell) => (
            <Sell key={sell.id} sell={sell} />
          ))}

        </ThemedView >
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
});
