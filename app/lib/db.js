//import { enablePromise } from 'react-native-sqlite-storage';
import * as SQLite from 'expo-sqlite';
//enablePromise(true);

const DATABASE_NAME = 'task.db';

function errorCallback(err) {
  console.log("SQL Error: " + err);
}

function okCallback() {
  console.log("Database OPENED");
}
export async function getDbConnection() {
  const db = await SQLite.openDatabase(DATABASE_NAME);
  //const db = await openDatabase({ name: DATABASE_NAME, createFromLocation : 1 });
  //const db = await openDatabase({name : DATABASE_NAME, createFromLocation : 1}, okCallback,errorCallback);
  //const db = await openDatabase({name: 'my.db', createFromLocation : 1, location: 'default'}, okCallback, errorCallback);
  //const db = await openDatabase("myDatabase.db", "1.0", "Demo", -1);
  console.log("Crear DB");
  return db;
}

export async function createTables(db) {
const query =
  'CREATE TABLE IF NOT EXISTS task(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(512))';
  return db.executeSql(query);
}

export async function initDatabase() {
  const db = await getDbConnection();
  //await createTables(db);
  //db.close();
}

export async function insertTask(db, title) {
  const insertQuery = `INSERT INTO task (title) values ('${title}')`;
  const result = await db.executeSql(insertQuery);
  return result;
}

export async function getTasks(db) {
  const tasks = [];
  const result = await db.executeSql('SELECT id, title FROM task');
  result.forEach(function(resultSet){
    for(let index = 0; index < resultSet.rows.length; index++) {
      tasks.push(resultSet.rows.item(index));
    }
  });
  return tasks;
}