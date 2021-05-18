#! /usr/bin/env node
const axios = require("axios");
const chalk = require("chalk");
const url = "https://quotes.rest/qod.json";
const { writeFileSync } = require("fs");
axios
  .get(url)
  .then((res) => {
    // const quote = res.data.contents.quotes[0].quote;
    // const author = res.data.contents.quotes[0].author;
    // const returnData = JSON.stringify(quote);
    // const log = chalk.green(` ${quote} - ${author}`);
    // writeFileSync("data.txt", returnData, (err) => {
    //   console.log(err);
    // });
    // console.log(log);
    const log = chalk.blue(`${res.data}`);
    console.log(log);
  })
  .catch((e) => {
    const log = chalk.red(e);
    console.log(log);
  });
