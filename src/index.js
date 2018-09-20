/* eslint-disable no-console */
import fs from 'fs';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import mysql from 'mysql2';
import axios from 'axios';
import MultiProgress from 'multi-progress';
import querystring from 'querystring';
import tunnel from 'tunnel-ssh';
import db from '../db/models';
import config from '../config';

dotenv.config();

const prefCodes = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県',
  '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県',
  '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県',
  '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県',
  '宮崎県', '鹿児島県', '沖縄県',
];

const typeRunner = {
  async CityCodes(multiProgress) {
    /* 都道府県をSQLに登録 */
    await Promise.all(prefCodes.map(
      (name, i) => db.sequelize.models.pref_codes.create({ id: i + 1, name }),
    ));

    /* 都道府県ごとの市町村コードをフェッチ */
    let cityProgress = multiProgress.newBar('[:bar] :percent :current/:total Fetching CityCodes', {
      complete: '=', incomplete: ' ', width: 20, total: prefCodes.length,
    });
    let data = [...new Array(prefCodes.length).keys()].map(async (i) => {
      const res = await axios({
        method: 'get',
        baseURL: 'http://www.land.mlit.go.jp/webland/api/CitySearch',
        params: { area: `0${i + 1}`.slice(-2) },
      });
      cityProgress.tick();
      return res.data.data;
    });
    data = await Promise.all(data);
    cityProgress.terminate();

    /* フェッチした市町村コードをSQLに登録 */
    cityProgress = multiProgress.newBar('[:bar] :percent :current/:total Writing CityCodes', {
      complete: '=', incomplete: ' ', width: 20, total: prefCodes.length,
    });
    let insertPromise = Promise.resolve();
    data.forEach((cities, i) => {
      cities.forEach((city) => {
        insertPromise = insertPromise.then(async () => {
          await db.sequelize.models.city_codes.create({
            id: parseInt(city.id, 10),
            pref_id: i + 1,
            name: city.name,
          });
        });
      });
      insertPromise = insertPromise.then(async () => {
        cityProgress.tick();
      });
    });
    await insertPromise;
    cityProgress.terminate();
  },
  async Manhole(multiProgress) {
    const progress = multiProgress.newBar('Manhole [:bar] :percent :current/:total', {
      complete: '=', incomplete: ' ', width: 20, total: 0,
    });
    return db.sequelize.models.categories.findOrCreate({
      where: { name: 'Manhole' },
      defaults: { name: 'Manhole' },
    }).then(row => axios({
      method: 'get',
      url: `http://manholemap.juge.me/customsearch?${querystring.stringify({
        where: 'misc like \'神奈川%\' and text not like \'%\\n%\' limit 5',
        format: 'json',
      })}`,
    }).then((response) => {
      if (typeof response.data === 'string') response.data = JSON.parse(response.data.replace(/\t/g, ' '));
      progress.total = response.data.length;
      return response.data.reduce((pre, cur) => pre.then(() => axios({
        method: 'get',
        url: `http://www.finds.jp/ws/rgeocode.php?${querystring.stringify({
          json: '',
          lat: cur.lat,
          lon: cur.lng,
        })}`,
      })).then(res => `${res.data.result.municipality.mcode}`).catch(() => Promise.resolve())
        .then((cityCode) => {
          const values = {
            name: 'Manhole',
            desc: cur.text,
            category_id: (Array.isArray(row) ? row[0] : row).dataValues.id,
            geo: db.Sequelize.fn('ST_GeomFromText', `POINT(${cur.lat} ${cur.lng})`),
            geo_text: `${cur.lat},${cur.lng}`,
            pref_id: cityCode.substr(0, 2),
            city_id: cityCode,
          };
          if (process.env.DB_DIALECT === 'sqlite') delete values.geo;
          return (cityCode) ? db.sequelize.models.entities.create(values).catch((e) => {
            console.error(e);
            return Promise.resolve();
          }).then(async (model) => {
            const image = await axios({
              method: 'get',
              url: `http://manholemap.juge.me/get?id=${cur.id}`,
              responseType: 'arraybuffer',
            });
            fs.writeFileSync(`${process.env.STORAGE}/${model.dataValues.id}.jpg`,
              Buffer.from(image), 'binary');
          }).then(() => {
            progress.tick();
          }) : Promise.resolve();
        }), Promise.resolve());
    }));
  },
  async Temple(multiProgress) {
    let start = 18000;
    const results = 100;
    let count = -1;
    const progress = multiProgress.newBar('Temple [:bar] :percent :current/:total', {
      complete: '=', incomplete: ' ', width: 20, total: 0,
    });

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
        start += (results + 1);
        count = response.data.ResultInfo.Count;
        progress.total = response.data.ResultInfo.Total;
        return response.data.Feature.reduce((prev, v) => {
          const geo = v.Geometry.Coordinates.split(',');
          return prev.then(() => {
            const values = {
              name: v.Name,
              desc: v.Description || '',
              category_id: categoryId,
              geo: db.Sequelize.fn('ST_GeomFromText', `POINT(${geo[1]} ${geo[0]})`),
              geo_text: `${geo[1]},${geo[0]}`,
              pref_id: v.Property.GovernmentCode.substr(0, 2),
              city_id: v.Property.GovernmentCode,
            };
            if (process.env.DB_DIALECT === 'sqlite') delete values.geo;
            return db.sequelize.models.entities.create(values)
              .catch(() => Promise.resolve()).then(() => {
                progress.tick();
              });
          });
        }, Promise.resolve());
      });
    }
  },
  Zoo() {
    console.log('Sorry, This data is impossible');
  },
};

const start = async () => {
  if (db.sequelize.getDialect() === 'mysql') {
    console.log('Init databases');
    await new Promise((resolve) => {
      const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      });
      connection.query(`CREATE DATABASE IF NOT EXISTS ${db.sequelize.options.database} CHARACTER SET utf8 COLLATE utf8_general_ci`, () => {
        connection.close();
        resolve();
      });
    });
  }

  await db.sequelize.sync();
  const answers = await inquirer.prompt([
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
  ]);
  if (!answers.run) return;
  const multiProgress = new MultiProgress(process.stdout);
  await answers.type.reduce(
    (prev, curr) => prev.then(() => typeRunner[curr](multiProgress)),
    Promise.resolve(),
  );
  console.log('\nComplete!');
  db.sequelize.close();
};

(async () => {
  if (config.useTunnel) {
    console.log('Create ssh tunnel');
    await new Promise(((resolve, reject) => {
      tunnel(config.tunnel, (error) => {
        if (error) reject(error);
        resolve();
      });
    }));
  }
  await start();
})().catch((error) => {
  console.error(error);
  process.exit();
});
