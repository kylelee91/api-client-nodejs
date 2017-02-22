import "./auth";
import "./environments";
import { Settings } from "../src";

Settings.url = "https://api.dev.cycle.io";
Settings.auth.tokenUrl = "https://portal.dev.cycle.io/auth/token";
Settings.auth.refreshUrl = "https://portal.dev.cycle.io/auth/refresh";
