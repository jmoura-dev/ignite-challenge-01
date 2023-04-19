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

  select (table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        })
      })
    }

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

  oneUpdate (table, id, complete) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);
    const saveData = this.#database[table].filter(item => item.id === id );

    if(saveData.length <= 0) {
      throw new Error("Esta task não existe.");
    }

    const title = saveData[0].title;
    const description = saveData[0].description;
    const updated_at = new Date();
    const created_at = saveData[0].created_at;
    const completed_at = complete;

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = { id, title, description, updated_at, created_at, completed_at }
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