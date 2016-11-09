import "mocha";
import {
    Environments,
    Containers,
    Settings,
    Auth
} from "../src";
import {
    ApiResult
} from "../src/common/api";

declare var process: {
    readonly env: any;
};

Settings.url = "https://api.dev.cycle.io";
Settings.auth.tokenUrl = "https://portal.dev.cycle.io/auth/token";
Settings.auth.refreshUrl = "https://portal.dev.cycle.io/auth/refresh";

describe("Authorize:", () => {
    it("Auth via Password", async() => {
        let result = await Auth.passwordAuth({
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }
    });
});

describe("Environments:", () => {
    let e: ApiResult<Environments.Collection>;
    before(async () => {
        e = await Environments.document().get();
        if (!e.ok) {
            throw new Error(e.error.detail);
        }
    });

    it("Verifies that data is an array", async () => {
        if (!e.ok) {
            return;
        }

        if (e.value.data instanceof Array) {
            return;
        } else {
            throw new Error("Data is not an array");
        }
    });
});

describe("Containers:", () => {
    let c: ApiResult<Containers.Collection>;
    before(async () => {
        c = await Containers.document().get();
        if (!c.ok) {
            throw new Error(c.error.detail);
        }
    });

    it("Verifies that data is an array", async () => {
        if (!c.ok) {
            return;
        }

        if (c.value.data instanceof Array) {
            return;
        } else {
            throw new Error("Data is not an array");
        }
    });
});
