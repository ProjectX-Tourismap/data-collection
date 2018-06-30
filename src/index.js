/* eslint-disable no-console */
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import mysql from 'mysql2';
import axios from 'axios';
import MultiProgress from 'multi-progress';
import querystring from 'querystring';
import db from '../db/models';

dotenv.config();

const prefCodes = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県',
  '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県',
  '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県',
  '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県',
  '宮崎県', '鹿児島県', '沖縄県',
];

const typeRunner = {
  CityCodes() {
    const multiProgress = new MultiProgress(process.stdout);
    const prefProgress = multiProgress.newBar('Pref [:bar] :percent :current/:total', {
      complete: '=', incomplete: ' ', width: 20, total: prefCodes.length,
    });
    prefProgress.tick(0);
    const cityProgress = multiProgress.newBar('City [:bar] :percent :current/:total', {
      complete: '=', incomplete: ' ', width: 20, total: 0,
    });

    return prefCodes.reduce((prev, curr, index) => prev.then(() => db.sequelize.models
      .pref_codes.create({ id: index + 1, name: curr }))
      .then(() => axios({
        method: 'get',
        url: `http://www.land.mlit.go.jp/webland/api/CitySearch?${querystring.stringify({ area: `00${index + 1}`.slice(-2) })}`,
      }))
      .then(res => res.data.data)
      .then((data) => {
        cityProgress.total = data.length;
        cityProgress.curr = 0;
        return data.reduce((pre, cur) => pre.then(() => db.sequelize.models.city_codes.create({
          pref_id: index + 1,
          city_id: parseInt(cur.id.substr(2, 3), 10),
          name: cur.name,
        })).then(() => {
          cityProgress.tick();
        }), Promise.resolve());
      })
      .then(() => {
        prefProgress.tick();
      }), Promise.resolve())
      .then(() => {
        multiProgress.terminate();
      });
  },
  Manhole() {
    const multiProgress = new MultiProgress(process.stdout);
    const progress = multiProgress.newBar('Manhole [:bar] :percent :current/:total', {
      complete: '=', incomplete: ' ', width: 20, total: 0,
    });
    return db.sequelize.models.categories.findOrCreate({
      where: { name: 'Manhole' },
      defaults: { name: 'Manhole' },
    }).then(row => axios({
      method: 'get',
      url: `http://manholemap.juge.me/customsearch?${querystring.stringify({
        where: 'misc like \'東京都%\'',
        format: 'json',
      })}`,
    }).then(response => response.data.reduce((pre, cur) => pre.then(() => axios({
      method: 'get',
      url: `http://www.finds.jp/ws/rgeocode.php?${querystring.stringify({
        json: '',
        lat: cur.lat,
        lon: cur.lng,
      })}`,
    })).then(res => `${res.data.result.municipality.mcode}`)
      .then(cityCode => db.sequelize.models.entities.create({
        name: 'Manhole',
        desc: cur.text,
        category_id: (Array.isArray(row) ? row[0] : row).dataValues.id,
        geo: db.Sequelize.fn('ST_GeomFromText', `POINT(${cur.lat} ${cur.lng})`),
        geo_text: `${cur.lat},${cur.lng}`,
        pref_id: cityCode.substr(0, 2),
        city_id: cityCode.substr(2, 3),
      }).then(() => {
        progress.tick();
      })), Promise.resolve()))).then(() => {
      multiProgress.terminate();
    });
  },
  async Temple() {
    let start = 0;
    const results = 100;
    let count = -1;
    const multiProgress = new MultiProgress(process.stdout);
    let progress;

    let categoryId = await db.sequelize.models.categories.findOrCreate({
      where: { name: 'Temple' },
      defaults: { name: 'Temple' },
    });
    categoryId = (Array.isArray(categoryId) ? categoryId[0] : categoryId).dataValues.id;

    for (; count !== 0;) {
      /* eslint-disable no-await-in-loop,no-loop-func */
      await axios({
        method: 'get',
        url: `https://map.yahooapis.jp/search/local/V1/localSearch?${querystring.stringify({
          appId: process.env.YAHOO_APP_ID,
          output: 'json',
          detail: 'full',
          as: '13', // 東京都
          gc: '0424', // 神社, 寺院, 教会
          start,
          results,
        })}`,
      }).then((response) => {
        if (!progress) {
          progress = multiProgress.newBar('', {
            complete: '=', incomplete: ' ', width: 20, total: response.data.ResultInfo.Total,
          });
        }
        start += (results + 1);
        count = response.data.ResultInfo.Count;
        return response.data.Feature.reduce((prev, v) => {
          const geo = v.Geometry.Coordinates.split(',');
          return prev.then(() => db.sequelize.models.entities.create({
            name: v.Name,
            desc: v.Description || '',
            category_id: categoryId,
            geo: db.Sequelize.fn('ST_GeomFromText', `POINT(${geo[1]} ${geo[0]})`),
            geo_text: `${geo[1]},${geo[0]}`,
            pref_id: v.Property.GovernmentCode.substr(0, 2),
            city_id: v.Property.GovernmentCode.substr(2, 3),
          })).then(() => {
            progress.tick();
          });
        }, Promise.resolve());
      });
    }
    multiProgress.terminate();
  },
  Zoo() {
    console.log('Sorry, This data is impossible');
  },
};

function showPrompts() {
  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'type',
        message: 'Select insert data',
        choices: ['CityCodes', 'Manhole', 'Temple', 'Zoo'],
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
    .then(async (answers) => {
      if (!answers.run) return;
      await answers.type.reduce((prev, curr) => prev.then(typeRunner[curr]), Promise.resolve());
      db.sequelize.close();
      console.log('Complete!');
    });
}

console.log('Init databases');
if (db.sequelize.getDialect() === 'mysql') {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  connection.query(`CREATE DATABASE IF NOT EXISTS ${db.sequelize.options.database} CHARACTER SET utf8 COLLATE utf8_general_ci`, () => {
    connection.close();
    db.sequelize.sync().then(showPrompts);
  });
} else {
  db.sequelize.sync().then(showPrompts);
}
