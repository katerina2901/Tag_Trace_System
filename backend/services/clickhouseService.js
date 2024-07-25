const ClickHouse = require('@apla/clickhouse');

const clickhouse = new ClickHouse({
  url: 'http://localhost',
  port: 8123,
  debug: false,
  basicAuth: {
    username: 'default',
    password: '123',
  },
  isUseGzip: false,
  format: "json",
});

exports.insertPill = async ({ manufacturer, SKU, productionDate, secret, transactionHash, status}) => {
  const query = `
    INSERT INTO tag_trace.transactions (manufacturer, SKU, productionDate, secret, transactionHash, status)
    VALUES ('${manufacturer}', '${SKU}', '${productionDate}', '${secret}', '${transactionHash}', '${status}')
  `;
  return new Promise((resolve, reject) => {
    clickhouse.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.updatePillStatus = async (secret, status) => {
  const query = `
      ALTER TABLE tag_trace.transactions UPDATE status = ${status} WHERE secret = '${secret}'
  `;
  return new Promise((resolve, reject) => {
      clickhouse.query(query, (err, result) => {
          if (err) {
              console.error('Error updating pill status in ClickHouse:', err);
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
};

exports.logQrScan = async ({ secret, scanTime, status }) => {
  const query = `
      INSERT INTO tag_trace.qr_scan_logs (secret, scanTime, status)
      VALUES ('${secret}', '${scanTime}', ${status})
  `;
  return new Promise((resolve, reject) => {
      clickhouse.query(query, (err, result) => {
          if (err) {
              console.error('Error logging QR scan in ClickHouse:', err);
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
};

exports.getPillInfo = async (secret) => {
    const query = `SELECT * FROM tag_trace.transactions WHERE secret = '${secret}' FORMAT JSONEachRow`;
    console.log('Executing query:', query);
    return new Promise((resolve, reject) => {
      clickhouse.query(query, (err, rows) => {
        if (err) {
          console.error('Query error:', err);
          reject(err);
        } else {
          // console.log('Rows Query Result:', JSON.stringify(rows, null, 2));
          if (rows && typeof rows === 'object' && !Array.isArray(rows)) {
            // console.log('Pill Found:', rows);
            resolve(rows);
          } else {
            // console.log('No Pill Found');
            resolve(null);
          }
        }
      });
    });
};

