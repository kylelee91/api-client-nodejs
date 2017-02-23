import "./auth";
// import "./environments";
// import "./images";
import "./accounts";
import { Settings } from "../src";

Settings.url = "https://api.dev.cycle.io";
Settings.auth.tokenUrl = "https://portal.dev.cycle.io/auth/token";
Settings.auth.refreshUrl = "https://portal.dev.cycle.io/auth/refresh";
