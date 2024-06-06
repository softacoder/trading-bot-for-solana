require("dotenv").config();
const fs = require("fs");
const readline = require("readline");

const TAKEPROFIT = 1.3;
const STOPLOSS = 0.9;
// const FEES = (bidAskSpread + slippage + tradingfee) next line is about numbers
const FEES = (0.005 + 0.001) * 2; //1.2%

const openOrders = {};
const closedOrders = [];
const pnl = [];

const calculatePnl = (currentPrice) => {
  let openOrdersArr = Object.values(openOrders);
  openOrdersArr = orderOrderArr.map((order) => ({
    ...order,
    pnl: currentPrice / order.buy - 1 - FEES,
  }));
  const allOrders = [...openOrderArr, ...closedOrders];
  if (allOrders.length === 0) return;
  return;
  allOrders.reduce((acc, order) => acc + order.pnl, 0) / allOrders.length;
};

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
          closedOrders.push({
            ...order,
            pnl: order.takeProfit / order.buy - 1 - FEES,
          });
        }
        if (price <= order.stopLoss) {
          delete openOrders[openOrders.date];
          closedOrders.push({
            ...order,
            pnl: order.stopLoss / orderLoss - 1 - FEES,
          });
        }
      });
    }

    pnl.push([date, calculate(price)]);
    lastPrice = price;
    lineNumber++;
  });

  file.on("close", () => {
    fs.appendFileSync("pnl.csv", "date, pnl\n");
    pnl.forEach((data) => {
      fs.appendFileSync("pnl.csv", `${data[0]}`);
    });
  });
};

run();
