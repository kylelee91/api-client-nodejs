import * as Cycle from "../src";
import "mocha";

Cycle.Settings.url = "https://api.dev.cycle.io";
Cycle.Settings.auth.tokenUrl = "https://portal.dev.cycle.io/auth/token";
Cycle.Settings.auth.refreshUrl = "https://portal.dev.cycle.io/auth/refresh";

describe("Authorize:", () => {
    it("Auth via Password", async() => {
        let result = await Cycle.Auth.passwordAuth({
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }
    });
});

describe("Environments:", () => {
    it("Get a list of environments", async () => {
        let e = await Cycle.Environments.document().get();
        
        if (!e.ok) {
            throw new Error(e.error.detail);
        }
    });
});

describe("Containers:", () => {
    it("Get a list of containers", async () => {
        let c = await Cycle.Containers.document().get();
        
        if (!c.ok) {
            throw new Error(c.error.detail);
        }
    });
});
