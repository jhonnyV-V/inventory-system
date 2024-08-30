import { StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

type ProductType = {
  id: number
  name: string
  stock: number
  value: number
}

function Product({ product }: { product: ProductType }) {
  return (
    <ThemedView style={[styles.stepContainer, { flexDirection: 'row' }]}>
      <ThemedText>{product.name}</ThemedText>
      <ThemedText>disponible: {product.stock}</ThemedText>
      <ThemedText>precio: {product.value / 1000}$</ThemedText>
    </ThemedView>
  );
}

export default function Products() {
  const db = useSQLiteContext();
  const [products, setProducts] = useState<ProductType[]>([])
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [value, setValue] = useState('');

  async function getData() {
    const data = await db.getAllAsync<ProductType>('SELECT * FROM products');
    setProducts(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Productos</ThemedText>
      </ThemedView>
      {products.length === 0 && (
        <ThemedText type="defaultSemiBold">No hay productos registrados</ThemedText>
      )}

      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
      {showModal ? (
        <ThemedView style={{ marginTop: 10 }}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder='Nombre'
          />
          <TextInput
            style={styles.input}
            onChangeText={setStock}
            value={stock}
            keyboardType='numeric'
            placeholder='Disponible'
            inputMode='numeric'
          />
          <TextInput
            style={styles.input}
            onChangeText={setValue}
            value={value}
            placeholder='Precio'
            keyboardType='numeric'
            inputMode='numeric'
          />
          <Button
            label='añadir'
            variant='primary'
            onPress={async () => {
              await db.runAsync(
                'INSERT INTO products (name, stock, value) VALUES (?, ?,?)',
                name,
                Math.floor(Number(stock)),
                Math.floor(Number(value) * 1000)
              );
              setStock('');
              setValue('');
              setName('');
              await getData();
              setShowModal(false)
            }}
          />
        </ThemedView >
      ) : (
        <ThemedView style={{ marginTop: 10 }}>
          <Button
            label='añadir producto'
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
