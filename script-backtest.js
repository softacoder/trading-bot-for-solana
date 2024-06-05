require("dotenv").config();
const fs = require("fs");
const readline = require("readline");

const run = async () => {
  const file = readline.createInterface({
    input: fs.createReadStream("prices.csv"),
    output: process.stdout,
    terminal: false,
  });

  let firstPrice, lastPrice;
  let lineNumber = 0;
  file.on("line", (line) => {
    let [date, price, movingAvg] = line.split(",");
    price = parseFloat(price);
    movingAvg = parseFloat(movingAvg);

    if (lineNumber === 0) {
      lineNumber++;
      return;
    }

    if (lineNumber === 1) {
      firstPrice = price;
    }
    //
    if (lineNumber > 7) {
      if (price > movingAvg) {
        openOrders[date] = {
          buy: price,
          takeProfit: price * TAKEPROFIT,
          stopLoss: price * STOPLOSS,
        };
      }
      const openOrderArr = Object.values(openOrders);
      openOrderArr.forEach((order) => {
        if (price >= order.takeProfit) {
          delete openOrders[openOrders.date];
        }
      });
    }
  });
};

run();
