// require("dotenv").config();
// const fs = require("fs");

// const apiUrlHist = `https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&interval=daily=365&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`;

// const run = async () => {
//   let res, resJson;
//   res = await fetch(apiUrlHist, {
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   });
//   resJson = await res.json();
//   fs.appendFileSync("prices.csv", "date, price, 7-days moving avg\n");
//   resJson.prices.forEach((data, i) => {
//     let average = "N/A";
//     if (i > 6) {
//       let sum = 0;
//       for (let j = 1; j < 8; j++) {
//         sum += resJson.prices[i - j][1];
//       }
//       average = sum / 7;
//     }
//     fs.appendFileSync(
//       "prices.csv",
//       `${data[0].toString()},${data[1].toString()},${average.toString()}\n`
//     );
//   });
// };

// run();

require("dotenv").config();
const fs = require("fs");

const apiUrlHist = `https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&interval=daily&days=365&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`;

const run = async () => {
  try {
    const res = await fetch(apiUrlHist, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resJson = await res.json();
    console.log("API response:", resJson); // Log the API response

    if (!resJson.prices || !Array.isArray(resJson.prices)) {
      throw new Error("Invalid response structure: 'prices' is not an array");
    }

    fs.writeFileSync("prices.csv", "date,price,7-days moving avg\n");
    resJson.prices.forEach((data, i) => {
      let average = "N/A";
      if (i > 6) {
        let sum = 0;
        for (let j = 1; j < 8; j++) {
          sum += resJson.prices[i - j][1];
        }
        average = sum / 7;
      }
      fs.appendFileSync(
        "prices.csv",
        `${new Date(data[0]).toISOString().split("T")[0]},${
          data[1]
        },${average}\n`
      );
    });
    console.log("Data successfully written to prices.csv");
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

run();
