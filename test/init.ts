import * as Cycle from "../src";
import "mocha";

Cycle.Settings.update({
    url: "https://api.dev.cycle.io",
    auth: {
        tokenUrl: "https://portal.dev.cycle.io/auth/token",
        refreshUrl: "https://portal.dev.cycle.io/auth/refresh"
    }
});

describe("Authorize", () => {
    it("Auth via Password", async() => {
        let result = await Cycle.Auth.passwordAuth({
            username: "alex",
            password: "9IXVnU8tH9baHA7",
            client_id: "",
            client_secret: ""
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }

        console.log(result.value);
    });
});

describe("Environments", () => {
    it("Get a list of environments", async () => {
        let e = await Cycle.Environments.document().get();
        if (!e.ok) {
            console.error(e.error);
            return;
        }

        console.log(e.value);
    });
});
