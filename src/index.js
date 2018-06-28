/* eslint-disable no-console */
import dotenv from 'dotenv';
import inquirer from 'inquirer';

dotenv.config();

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
