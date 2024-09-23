import fs from "node:fs/promises";
import { getDateLocal } from "./src/utils/get-date-local.js";

const databasePath = new URL("./db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  selectOne(table, id) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      return this.#database[table][rowIndex];
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const updatedData = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = {
        ...updatedData,
        ...data,
        updated_at: getDateLocal(),
      };
      this.#persist();
      return this.#database[table][rowIndex];
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const data = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = {
        ...data,
        completed_at: getDateLocal(),
      };
      this.#persist();
    }
  }
}
