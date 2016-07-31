import * as CycleApi from "../../../src/index";

CycleApi.Settings.version = "1";

let configured = false;

export default async function configure() {
    if (!configured) {
        try {
            CycleApi.Settings.url = "https://api.dev.cycle.io";
            CycleApi.Settings.auth.tokenUrl = "https://portal.dev.cycle.io/auth/token";
            CycleApi.Settings.auth.refreshUrl = "https://portal.dev.cycle.io/auth/refresh";
            await CycleApi.Auth.passwordAuth({
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                client_id: "",
                client_secret: ""
            });

            configured = true;
        } catch (e) {
            if (e instanceof CycleApi.JsonApi.JsonApiError) {
                console.error(e);
            }
        }
    }
}


