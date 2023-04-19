import fs from "node:fs/promises";

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data);
      })
        .catch(() => {
          this.#persist()
        });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select (table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert (table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update (table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);
    const saveData = this.#database[table].filter(item => item.id === id );

    if(saveData.length <= 0) {
      throw new Error("Esta task não existe.");
    }

    const created_at = saveData[0].created_at;
    const completed_at = saveData[0].completed_at;

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data, created_at, completed_at }
      this.#persist();
    }
  }

  delete (table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex <= -1) {
      throw new Error("Esta task não existe.")
    }

    if(rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}