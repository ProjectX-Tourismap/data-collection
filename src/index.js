/* eslint-disable no-console */
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import mysql from 'mysql2';
import db from '../db/models';

dotenv.config();

if (db.sequelize.getDialect() === 'mysql') {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  connection.query(`CREATE DATABASE IF NOT EXISTS ${db.sequelize.options.database} CHARACTER SET utf8 COLLATE utf8_general_ci`, (err) => {
    connection.close();
    db.sequelize.sync();
  });
} else {
  db.sequelize.sync();
}

const typeRunner = {
  Manhole() {
    console.log('A');
  },
  Temple() {
    console.log('B');
  },
  Zoo() {
    console.log('C');
  },
};

inquirer
  .prompt([
    {
      type: 'checkbox',
      name: 'type',
      message: 'What correct?',
      choices: ['Manhole', 'Temple', 'Zoo'],
      validate(input) {
        return input.length !== 0 ? true : 'Select at least one';
      },
    },
    {
      type: 'confirm',
      name: 'run',
      message: 'Will you execute it?',
      default: false,
    },
  ])
  .then((answers) => {
    if (!answers.run) return;
    answers.type.forEach(v => typeRunner[v]());
    console.log('Complete!');
  });
