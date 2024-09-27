import { StyleSheet } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import CheckBox from 'react-native-bouncy-checkbox';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import Button from '@/components/Button';

import type { Customer, Payment, Product, Sell, SellProduct } from '@/hooks/useDb';
import { Collapsible } from '@/components/Collapsible';
import { useFocusEffect } from 'expo-router';


type modalType = 'sell' | 'payment' | 'none'
type Props = {
  setModal: React.Dispatch<
    React.SetStateAction<modalType>
  >,
};

type CustomerProps = {
  customer: Customer,
  isSelected: boolean,
  displayButton: boolean,
  select: React.Dispatch<React.SetStateAction<Customer | undefined>>,
}

function Customer({ customer, isSelected, displayButton = true, select }: CustomerProps) {

  return (
    <ThemedView style={styles.customerContainer}>
      <ThemedText>{customer.name}</ThemedText>
      {isSelected && (
        <Button
          label='deseleccionar'
          variant='primary'
          onPress={() => select(undefined)}
          containerStyles={styles.button}
        />
      )}
      {!isSelected && displayButton && (
        <Button
          label='seleccionar'
          variant='primary'
          onPress={() => select(customer)}
          containerStyles={styles.button}
        />
      )}
    </ThemedView>
  );
}

type ProductProps = {
  product: Product,
  isSelected: boolean,
  select: React.Dispatch<React.SetStateAction<Product[]>>,
  productToQuantity: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>,
}

function Product({ product, isSelected, select, productToQuantity }: ProductProps) {

  return (
    <ThemedView style={{ marginBottom: 15 }}>
      <ThemedView style={styles.productContainer}>
        <ThemedText>{product.name}</ThemedText>
        {isSelected && (
          <Button
            label='deseleccionar'
            variant='primary'
            onPress={() => {
              select((products) => products.filter((p) => p.id !== product.id));
              productToQuantity((maping) => {
                delete maping[product.id];
                return maping;
              });
            }}
            containerStyles={styles.button}
          />
        )}
        {!isSelected && (
          <Button
            label='seleccionar'
            variant='primary'
            onPress={() => {
              select((products) => [...products, product]);
              productToQuantity((maping) => {
                maping[product.id] = 1;
                return maping;
              });
            }}
            containerStyles={styles.button}
          />
        )}
      </ThemedView>
      {isSelected && (
        <ThemedTextInput
          style={styles.input}
          onChangeText={(v) => {
            if (Number(v) > 0) {
              productToQuantity((maping) => {
                maping[product.id] = Number(v);
                return maping;
              });
            }
          }}
          defaultValue='1'
          keyboardType='numeric'
          inputMode='numeric'
        />
      )}
    </ThemedView>
  );
}

function Sell({ setModal }: Props) {
  const db = useSQLiteContext();
  const [customers, setCustomers] = useState<Customer[]>([{ id: 1, name: 'Anonimo' }]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productToQuantity, setProductToQuantity] = useState<{ [key: number]: number }>({});
  const [cUsd, setCUsd] = useState(false);
  const [cBs, setCBs] = useState(true);
  const [pmCash, setPmCash] = useState(false);
  const [pmTransfer, setPmTransfer] = useState(true);
  const [amount, setAmount] = useState('0');

  useFocusEffect(
    useCallback(() => {
      async function getCustomers() {
        const data: Customer[] = await db.getAllAsync('SELECT * FROM customers');
        setCustomers(data);
      }
      getCustomers();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      async function getProducts() {
        const data: Product[] = await db.getAllAsync('SELECT * FROM products');
        setProducts(data);
      }
      console.log("get products in index")
      getProducts();
    }, [])
  );

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Registrar Venta</ThemedText>
      </ThemedView>
      <ThemedView style={{ marginTop: 10 }}>
        <Collapsible title='Selecciona un cliente (opcional)'>
          {customers.map((customer) => (
            <Customer
              key={customer.id}
              customer={customer}
              isSelected={customer.id === selectedCustomer?.id}
              displayButton={!selectedCustomer}
              select={setSelectedCustomer}
            />
          ))}
        </Collapsible>
      </ThemedView >
      <ThemedView style={{ marginTop: 10 }}>
        <Collapsible title='Selecciona un/os producto/s'>
          {products.map((product) => (
            <Product
              key={product.id}
              product={product}
              isSelected={selectedProducts.findIndex((p) => product.id === p.id) !== -1}
              select={setSelectedProducts}
              productToQuantity={setProductToQuantity}
            />
          ))}
        </Collapsible>
      </ThemedView >
      <ThemedView style={{ marginTop: 10 }}>
        <ThemedText type='subtitle'>
          Moneda del pago (opcional)
        </ThemedText>

        <ThemedView style={{ flexDirection: 'row' }}>
          <CheckBox
            isChecked={cUsd}
            useBuiltInState={false}
            onPress={(newValue) => {
              setCUsd(!newValue)
              setCBs(newValue)
            }}
          />
          <ThemedText type='default'>
            Dolares
          </ThemedText>
        </ThemedView >

        <ThemedView style={{ flexDirection: 'row' }}>
          <CheckBox
            useBuiltInState={false}
            isChecked={cBs}
            onPress={(newValue) => {
              setCBs(!newValue)
              setCUsd(newValue)
            }}
          />
          <ThemedText type='default'>
            Bolivares
          </ThemedText>
        </ThemedView >

      </ThemedView >

      {cBs && (
        <ThemedView style={{ marginTop: 10 }}>
          <ThemedText type='subtitle'>
            Metodo de pago (opcional)
          </ThemedText>

          <ThemedView style={{ flexDirection: 'row' }}>
            <CheckBox
              isChecked={pmCash}
              useBuiltInState={false}
              onPress={(newValue) => {
                setPmCash(!newValue)
                setPmTransfer(newValue)
              }}
            />
            <ThemedText type='default'>
              Efectivo
            </ThemedText>
          </ThemedView >

          <ThemedView style={{ flexDirection: 'row' }}>
            <CheckBox
              useBuiltInState={false}
              isChecked={pmTransfer}
              onPress={(newValue) => {
                setPmTransfer(!newValue)
                setPmCash(newValue)
              }}
            />
            <ThemedText type='default'>
              Transferencia
            </ThemedText>
          </ThemedView >

        </ThemedView >
      )}

      <ThemedView style={{ marginTop: 10 }}>
        <ThemedText type='subtitle'>
          Monto Pagado (opcional)
        </ThemedText>
        <ThemedTextInput
          style={styles.input}
          value={amount}
          onChangeText={(v) => setAmount(v)}
          keyboardType='numeric'
          inputMode='numeric'
        />
      </ThemedView>

      <ThemedView style={{ marginTop: 40 }}>
        <Button
          label='registar venta'
          variant='primary'
          onPress={async () => {
            let amountpaid = Number(amount);
            if (amountpaid > 0) {
              if (cUsd) {
                amountpaid = Math.floor(amountpaid * 1000);
              } else {
                amountpaid = Math.floor((amountpaid / 37) * 1000);
              }
            }

            console.log("selected Products", selectedProducts);
            console.log("selected Products is empty", selectedProducts.length === 0);

            if (selectedProducts.length === 0) {
              console.log("select product is in fact empty")
              alert("Necesitas selecionar al menos un producto");
              return
            }

            const SellExample: Sell = {
              id: 1,
              createdAt: '',
              customer_id: 1,
              payment_method: 'cash',
              currency: 'dolars',
              amount_paid: 1.27 * 1000
            };

            let cashOrTransfer = '';
            if (cUsd) {
              cashOrTransfer = 'cash';
            } else {
              cashOrTransfer = pmTransfer ? 'transfer' : 'cash';
            }

            await db.runAsync(
              'INSERT INTO sells (customer_id, payment_method, currency, amount_paid) VALUES (?, ?, ?, ?)',
              selectedCustomer?.id || 1,
              cashOrTransfer,
              cUsd ? 'dolars' : 'bolivares',
              amountpaid,
            );

            const count = (await db.getFirstAsync<{ 'COUNT(*)': number }>('SELECT COUNT(*) FROM sells'))?.['COUNT(*)'] || 1;
            console.log('COUNT', count);

            const ExampleProducts: SellProduct[] = [{
              id: 1,
              units: 1,
              sell_id: 1,
              product_id: 1
            }];

            for (const product of selectedProducts) {
              const units = productToQuantity[product.id];
              await db.runAsync(
                'INSERT INTO sells_products (units, sell_id, product_id) VALUES (?,?,?)',
                units,
                count,
                product.id,
              );

              await db.runAsync(
                'UPDATE products SET stock=? WHERE id=?',
                product.stock - units,
                product.id
              );
            }

            alert("Venta Registrada");

            setModal('none')
          }}
        />
        <Button
          label='cancelar'
          variant='primary'
          onPress={() => {
            setModal('none')
          }}
        />
      </ThemedView >

    </>
  );
}

function Payment({ setModal }: Props) {
  const db = useSQLiteContext();
  const [customers, setCustomers] = useState<Customer[]>([{ id: 1, name: 'Anonimo' }]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [cUsd, setCUsd] = useState(false);
  const [cBs, setCBs] = useState(true);
  const [pmCash, setPmCash] = useState(false);
  const [pmTransfer, setPmTransfer] = useState(true);
  const [amount, setAmount] = useState('0');

  useFocusEffect(
    useCallback(() => {
      async function getCustomers() {
        const data: Customer[] = await db.getAllAsync('SELECT * FROM customers');
        setCustomers(data);
      }
      getCustomers()
      console.log("get customers in index")
    }, [])
  );

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Registrar Pago</ThemedText>
      </ThemedView>

      <ThemedView style={{ marginTop: 10 }}>
        <Collapsible title='Selecciona un cliente'>
          {customers.map((customer) => (
            <Customer
              key={customer.id}
              customer={customer}
              isSelected={customer.id === selectedCustomer?.id}
              displayButton={!selectedCustomer}
              select={setSelectedCustomer}
            />
          ))}
        </Collapsible>
      </ThemedView >

      <ThemedView style={{ marginTop: 10 }}>
        <ThemedText type='subtitle'>
          Moneda del pago
        </ThemedText>

        <ThemedView style={{ flexDirection: 'row' }}>
          <CheckBox
            isChecked={cUsd}
            useBuiltInState={false}
            onPress={(newValue) => {
              setCUsd(!newValue)
              setCBs(newValue)
            }}
          />
          <ThemedText type='default'>
            Dolares
          </ThemedText>
        </ThemedView >

        <ThemedView style={{ flexDirection: 'row' }}>
          <CheckBox
            useBuiltInState={false}
            isChecked={cBs}
            onPress={(newValue) => {
              setCBs(!newValue)
              setCUsd(newValue)
            }}
          />
          <ThemedText type='default'>
            Bolivares
          </ThemedText>
        </ThemedView >

      </ThemedView >

      {cBs && (
        <ThemedView style={{ marginTop: 10 }}>
          <ThemedText type='subtitle'>
            Metodo de pago
          </ThemedText>

          <ThemedView style={{ flexDirection: 'row' }}>
            <CheckBox
              isChecked={pmCash}
              useBuiltInState={false}
              onPress={(newValue) => {
                setPmCash(!newValue)
                setPmTransfer(newValue)
              }}
            />
            <ThemedText type='default'>
              Efectivo
            </ThemedText>
          </ThemedView >

          <ThemedView style={{ flexDirection: 'row' }}>
            <CheckBox
              useBuiltInState={false}
              isChecked={pmTransfer}
              onPress={(newValue) => {
                setPmTransfer(!newValue)
                setPmCash(newValue)
              }}
            />
            <ThemedText type='default'>
              Transferencia
            </ThemedText>
          </ThemedView >
        </ThemedView >
      )}

      <ThemedView style={{ marginTop: 10 }}>
        <ThemedText type='subtitle'>
          Monto Pagado
        </ThemedText>
        <ThemedTextInput
          style={styles.input}
          value={amount}
          onChangeText={(v) => setAmount(v)}
          keyboardType='numeric'
          inputMode='numeric'
        />
      </ThemedView>


      <ThemedView style={{ marginTop: 10 }}>
        <Button
          label='registar pago'
          variant='primary'
          onPress={async () => {
            let amountpaid = Number(amount);
            if (amountpaid > 0) {
              if (cUsd) {
                amountpaid = Math.floor(amountpaid * 1000);
              } else {
                amountpaid = Math.floor((amountpaid / 37) * 1000);
              }
            } else {
              alert("Monto pagado debe ser mayor a 0");
              return
            }

            if (!selectedCustomer?.id) {
              alert("Necesita seleccionar un cliente");
              return
            }

            const example: Payment = {
              id: 1,
              createdAt: '',
              customer_id: 1,
              payment_method: 'cash',
              currency: 'dolars',
              amount_paid: 0,
            };

            let cashOrTransfer = '';
            if (cUsd) {
              cashOrTransfer = 'cash';
            } else {
              cashOrTransfer = pmTransfer ? 'transfer' : 'cash';
            }

            await db.runAsync(
              'INSERT INTO payments (customer_id, payment_method, currency, amount_paid) VALUES (?, ?, ?, ?)',
              selectedCustomer?.id || 1,
              cashOrTransfer,
              cUsd ? 'dolars' : 'bolivares',
              amountpaid,
            );

            alert("Pago Registrado");

            setModal('none')
          }}
        />
        <Button
          label='cancelar'
          variant='primary'
          onPress={() => {
            setModal('none')
          }}
        />
      </ThemedView >
    </>
  );
}

export default function Home() {
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
  customerContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  button: {
    height: 30,
    width: 120,
  },
});
