const startBrowser = require("./browser");
const scrapController = require("./scrapController");

let browser = startBrowser();
scrapController(browser);
