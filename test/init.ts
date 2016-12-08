import "mocha";
import {
    Environments,
    Containers,
    Settings,
    Images,
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
    it("Auth via API Key", async() => {
        let result = await Auth.apiKeyAuth({
            secret: process.env.APIKEY
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }
    });
});
/*
describe("Environments:", () => {
    it("Verifies that data is an array", async () => {
        const e = await Environments.document().get();
        if (!e.ok) {
            throw new Error(e.error.title);
        }

        if (e.value.data instanceof Array) {
            return;
        } else {
            throw new Error("Data is not an array");
        }
    });
*/
/*
    it("Creates environment", async () => {
        const e = await Environments.document().create({
            name: "Test Env API"
        });
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });
*/
/*
    it("Deletes environment", async () => {
        const e = await Environments.document("5840975f1b847a65e05aade9").delete();
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });
*/
/*
    it("Updates environment", async () => {
        const e = await Environments.document("584097c21b847a65e05aadeb").update({
            name: "Test Update API",
            about: {
                description: "This is updating the description of environment"
            } 
        });
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
        console.log(e.value);
    });
*/
/*
    it("Gets single environment", async () => {
        const e = await Environments.document("584097c21b847a65e05aadeb").get();
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });
*/
/*
    it("Task start environment", async () => {
        const e = await Environments.document("583f5df21b847a4c714cd9d9").task("start");
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });
*/
/*
    it("Task stop environment", async () => {
        const e = await Environments.document("583f5df21b847a4c714cd9d9").task("stop");
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });

*/
/*
    it("Start environment", async () => {
        const e = await Environments.document("583f5df21b847a4c714cd9d9").start();
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });
*/
/*
    it("Stop environment", async () => {
        const e = await Environments.document("583f5df21b847a4c714cd9d9").stop();
        if (!e.ok) {
            throw new Error(e.error.detail || e.error.title);
        }
    });

});
*/
describe("Images:", () => {
    it("Verifies that data is an array", async () => {
        const i = await Images.document().get();
        if (!i.ok) {
            throw new Error(i.error.title);
        }

        if (i.value.data instanceof Array) {
            return;
        } else {
            throw new Error("Data is not an array");
        }
    });
/*
    it("Deletes unused images", async () => {
        const i = await Images.document().deleteUnused();
        if (!i.ok) {
            throw new Error(i.error.detail || i.error.title);
        }
    });
*/
/*
    it("Updates environment", async () => {
        const i = await Images.document("58474d211b847a63ccdcd0ac").update({
            name: "Testing!",
            about: {
                description: "This is testing"
            }
        });
        if (!i.ok) {
            throw new Error(i.error.detail || i.error.title);
        }
    });
*/
    it("Updates environment", async () => {
        const i = await Images.document().create();
        if (!i.ok) {
            throw new Error(i.error.detail || i.error.title);
        }
    });

});

describe("Containers:", () => {
        it("Verifies that data is an array", async () => {
        const c = await Containers.document().get();
        if (!c.ok) {
            throw new Error(c.error.title);
        }

        if (c.value.data instanceof Array) {
            return;
        } else {
            throw new Error("Data is not an array");
        }
    });
});
