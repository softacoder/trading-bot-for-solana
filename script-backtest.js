// require("dotenv").config();
// const fs = require("fs");
// const readline = require("readline");

// const TAKEPROFIT = 1.9;
// const STOPLOSS = 0.7;
// // const FEES = (bidAskSpread + slippage + tradingfee) next line is about numbers
// const FEES = (0.005 + 0.001) * 2; //1.2%

// const openOrders = {};
// const closedOrders = [];
// const pnl = [];

// const calculatePnl = (currentPrice) => {
//   let openOrdersArr = Object.values(openOrders);
//   openOrdersArr = orderOrderArr.map((order) => ({
//     ...order,
//     pnl: currentPrice / order.buy - 1 - FEES,
//   }));
//   const allOrders = [...openOrderArr, ...closedOrders];
//   if (allOrders.length === 0) return;
//   return;
//   allOrders.reduce((acc, order) => acc + order.pnl, 0) / allOrders.length;
// };

// const run = async () => {
//   const file = readline.createInterface({
//     input: fs.createReadStream("prices.csv"),
//     output: process.stdout,
//     terminal: false,
//   });

//   let firstPrice, lastPrice;
//   let lineNumber = 0;
//   file.on("line", (line) => {
//     let [date, price, movingAvg] = line.split(",");
//     price = parseFloat(price);
//     movingAvg = parseFloat(movingAvg);

//     if (lineNumber === 0) {
//       lineNumber++;
//       return;
//     }

//     if (lineNumber === 1) {
//       firstPrice = price;
//     }
//     //
//     if (lineNumber > 7) {
//       if (price > movingAvg) {
//         openOrders[date] = {
//           buy: price,
//           takeProfit: price * TAKEPROFIT,
//           stopLoss: price * STOPLOSS,
//         };
//       }
//       const openOrderArr = Object.values(openOrders);
//       openOrderArr.forEach((order) => {
//         if (price >= order.takeProfit) {
//           delete openOrders[openOrders.date];
//           closedOrders.push({
//             ...order,
//             pnl: order.takeProfit / order.buy - 1 - FEES,
//           });
//         }
//         if (price <= order.stopLoss) {
//           delete openOrders[openOrders.date];
//           closedOrders.push({
//             ...order,
//             pnl: order.stopLoss / orderLoss - 1 - FEES,
//           });
//         }
//       });
//     }

//     pnl.push([date, calculate(price)]);
//     lastPrice = price;
//     lineNumber++;
//   });

//   file.on("close", () => {
//     fs.appendFileSync("pnl.csv", "date, pnl\n");
//     pnl.forEach((data) => {
//       fs.appendFileSync(
//         "pnl.csv",
//         `${data[0].toString()}, ${data[1].toString()}\n`
//       );
//     });
//     console.log(
//       `Pnl long position: ${((lastPrice / firstPrice - 1) * 100).toFixed(2)}%`
//     );
//     console.log(
//       `Pnl trading bot: ${(pnl[pnl.length - 1][1] * 100).toFixed(2)}%`
//     );
//   });
// };

// run();

require("dotenv").config();
const fs = require("fs");
const readline = require("readline");

const TAKEPROFIT = 1.9;
const STOPLOSS = 0.7;
const FEES = (0.005 + 0.001) * 2; // 1.2%

const openOrders = {};
const closedOrders = [];
const pnl = [];

const calculatePnl = (currentPrice) => {
  let openOrdersArr = Object.values(openOrders);
  openOrdersArr = openOrdersArr.map((order) => ({
    ...order,
    pnl: currentPrice / order.buy - 1 - FEES,
  }));
  const allOrders = [...openOrdersArr, ...closedOrders];
  if (allOrders.length === 0) return 0;
  return (
    allOrders.reduce((acc, order) => acc + order.pnl, 0) / allOrders.length
  );
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
    if (lineNumber === 0) {
      lineNumber++;
      return;
    }

    let [date, price, movingAvg] = line.split(",");
    price = parseFloat(price);
    movingAvg = parseFloat(movingAvg);

    if (lineNumber === 1) {
      firstPrice = price;
    }

    if (lineNumber > 7) {
      if (price > movingAvg) {
        openOrders[date] = {
          buy: price,
          takeProfit: price * TAKEPROFIT,
          stopLoss: price * STOPLOSS,
        };
      }

      const openOrdersArr = Object.values(openOrders);
      openOrdersArr.forEach((order) => {
        if (price >= order.takeProfit) {
          closedOrders.push({
            ...order,
            pnl: order.takeProfit / order.buy - 1 - FEES,
          });
          delete openOrders[date];
        } else if (price <= order.stopLoss) {
          closedOrders.push({
            ...order,
            pnl: order.stopLoss / order.buy - 1 - FEES,
          });
          delete openOrders[date];
        }
      });
    }

    pnl.push([date, calculatePnl(price)]);
    lastPrice = price;
    lineNumber++;
  });

  file.on("close", () => {
    console.log("Prices:", pnl);
    if (pnl.length === 0) {
      console.log("No PnL data to calculate.");
      return;
    }

    fs.writeFileSync("pnl.csv", "date,pnl\n");
    pnl.forEach((data) => {
      fs.appendFileSync(
        "pnl.csv",
        `${data[0].toString()},${data[1].toString()}\n`
      );
    });
    console.log(
      `Pnl long position: ${((lastPrice / firstPrice - 1) * 100).toFixed(2)}%`
    );
    console.log(
      `Pnl trading bot: ${(pnl[pnl.length - 1][1] * 100).toFixed(2)}%`
    );
  });
};

run();
