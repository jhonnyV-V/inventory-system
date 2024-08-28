import { SQLiteDatabase } from "expo-sqlite";

export async function migrate(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  //@ts-ignore
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  console.log("currentDbVersion", currentDbVersion);
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.withTransactionAsync(async () => {
      await db.execAsync('Pragma foreign_keys = ON');
      console.log('PRAGMA KEYS ON');
      await db.execAsync('PRAGMA user_version = ' + DATABASE_VERSION);
      console.log("set version");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products(
          id         INTEGER PRIMARY KEY NOT NULL,
          stock      INTEGER NOT NULL,
          value      INTEGER NOT NULL
        );
      `);
      console.log("create products table");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS customers(
          id         INTEGER PRIMARY KEY NOT NULL,
          name       TEXT NOT NULL
        );
      `);
      console.log("create customers table");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sells(
          id              INTEGER PRIMARY KEY NOT NULL,
          createdAt       DATETIME DEFAULT CURRENT_DATE,
          customer_id     INTEGER NOT NULL,
          payment_method  TEXT NOT NULL,
          amount_paid     INTEGER NOT NULL,
          currency        TEXT NOT NULL,
          FOREIGN KEY(customer_id) REFERENCES customers(id)
        );
      `);
      console.log("create sells table");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sells_products(
          id              INTEGER PRIMARY KEY NOT NULL, 
          units           INTEGER NOT NULL,
          sell_id         INTEGER NOT NULL,
          product_id      INTEGER NOT NULL,
          FOREIGN KEY(product_id) REFERENCES products(id)
          FOREIGN KEY(sell_id) REFERENCES sells(id)
        );
      `);
      console.log("create sells_products table");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS payments(
          id              INTEGER PRIMARY KEY NOT NULL,
          createdAt       DATETIME DEFAULT CURRENT_DATE,
          customer_id     INTEGER NOT NULL,
          payment_method  TEXT NOT NULL,
          amount_paid     INTEGER NOT NULL,
          currency        TEXT NOT NULL,
          FOREIGN KEY(customer_id) REFERENCES customers(id)
        );
      `);
      console.log("create payments table");

      await db.runAsync('INSERT INTO customers (id, name) VALUES (?, ?)', 1, "Anonimo");
    });

    currentDbVersion = 1;
  }

  if (currentDbVersion === 1) {
    return
  }
}
