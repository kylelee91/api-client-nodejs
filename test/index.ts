import "./auth";
// import "./images";
// import "./environments";
// import "./containers";
// import "./accounts";
// import "./volumes";
// import "./dns";
import "./plans";
import { Settings } from "../src";

Settings.url = "https://api.dev.cycle.io";
Settings.auth.tokenUrl = "https://portal.dev.cycle.io/auth/token";
Settings.auth.refreshUrl = "https://portal.dev.cycle.io/auth/refresh";
