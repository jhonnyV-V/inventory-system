import { StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import type { Payment, Sell, SellProduct } from '@/hooks/useDb';
import { SafeAreaView } from 'react-native-safe-area-context';
import { displayBS, displayDS } from '@/utils/utils';

type Debth = {
  name: string
  customer_id: number
  debth: number
}

type PopulatedPayment = Payment & {
  name: string
};

function Customer({ customer }: { customer: Debth }) {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText type='defaultSemiBold'>
        {customer.debth > 0 ? `le debes ${customer.name}` : `${customer.name} te debe`}
      </ThemedText>
      <ThemedText>en bolivares {displayBS(customer.debth)} bs</ThemedText>
      <ThemedText>en dolares {displayDS(customer.debth)} bs</ThemedText>
    </ThemedView>
  );
}

export default function Metrics() {
  const db = useSQLiteContext();
  const [debth, setDebth] = useState<Debth[]>([]);

  async function getData() {
    const idToDebth = new Map<number, { debth: number, name: string }>();
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
    for (const sell of sells) {
      const products = await db.getAllAsync<SellProduct & { name: string, value: number }>(
        `SELECT sells_products.*, products.name, products.value FROM sells_products
          INNER JOIN products ON sells_products.product_id = products.id
        WHERE sell_id=?`,
        sell.id,
      );

      if (!idToDebth.has(sell.customer_id)) {
        idToDebth.set(sell.customer_id, { name: sell.name, debth: 0 });
      }

      const current = idToDebth.get(sell.customer_id)!;

      let totalCost = 0;
      for (const product of products) {
        totalCost -= product.value * product.units;
      }
      totalCost += sell.amount_paid;

      idToDebth.set(
        sell.customer_id,
        {
          name: current.name,
          debth: current.debth + totalCost,
        }
      );
    }

    for (const payment of payments) {
      if (!idToDebth.has(payment.customer_id)) {
        idToDebth.set(payment.customer_id, { name: payment.name, debth: 0 });
      }

      const current = idToDebth.get(payment.customer_id)!;

      idToDebth.set(
        payment.customer_id,
        {
          name: current.name,
          debth: current.debth + payment.amount_paid,
        }
      );
    }

    const data: Debth[] = [];
    for (const [key, value] of idToDebth) {
      data.push({
        debth: value.debth,
        name: value.name,
        customer_id: key
      });
    }
    setDebth(data);
  }


  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Metricas</ThemedText>
          </ThemedView>

          <ThemedView style={{ marginTop: 30 }}>
          </ThemedView >

          {debth.map((customer) => (
            <Customer key={customer.customer_id} customer={customer} />
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
