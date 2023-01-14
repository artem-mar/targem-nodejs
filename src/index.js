import express from 'express';
import fsp from 'fs/promises';
import neatCsv from 'neat-csv';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import pool from './db.js';

dayjs.extend(customParseFormat);

const csvFilePath = './data/players.csv';

const run = async () => {
  const players = await fsp.readFile(csvFilePath, 'utf-8').then(neatCsv);
  const playerRows = players.map((player) => {
    const [fieldsString] = Object.values(player);
    const fields = fieldsString.split('; ');
    fields[2] = dayjs(fields[2], 'DD.MM.YYYY hh:mm').valueOf();
    return fields;
  });

  try {
    const client = await pool.connect();
    client.query(
      `CREATE TABLE IF NOT EXISTS players
    (
      nickname VARCHAR not null PRIMARY KEY,
      email VARCHAR not null,
      registered BIGINT not null,
      status VARCHAR not null
    )`,
    );

    playerRows.forEach((row) => {
      client.query(
        `INSERT INTO players
      (nickname, email, registered, status)
      VALUES ($1, $2, $3, $4)`,
        row,
        (err) => {
          if (err) {
            console.error('Error executing query:', err.detail);
          }
        },
      );
    });

    // выводим в консоль отфильтрованных по статусу и отростированных по дате регистрации игроков
    client.query("SELECT * FROM players WHERE status = 'On' ORDER BY registered ASC", (err, res) => {
      if (err) {
        console.error('Error executing query', err.stack);
      }
      console.log(res.rows);
    });

    client.release();
  } catch (e) {
    console.log(e);
  }
};

run();

const app = express();

// этих же (отфильтрованных/отсортированных) игроков можно получить гет запросом
app.get('/api', (req, res) => {
  pool.query("SELECT * FROM players WHERE status = 'On' ORDER BY registered ASC", (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
    }
    res.send(result.rows);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
