import "mocha";
import {
    Environments,
    Containers,
    Settings,
    Images,
    Auth,
    DataCenters,
    Plans,
    Jobs

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

//========================================================================================================================
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
//========================================================================================================================
/*
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
*/
/*
    it("Deletes unused images", async () => {
        const i = await Images.document().deleteUnused();
        if (!i.ok) {
            throw new Error(i.error.detail || i.error.title);
        }
    });
*/
/*
    it("Builds image", async () => {
       const i = await Images.document("584a23b41b847a3e7bb3ca2b").build();
       if (!i.ok) {
           throw new Error(i.error.detail || i.error.title);
       } 
    });
*/
/*
    it("Updates images", async () => {
        const i = await Images.document("584a23b31b847a3e7bb3ca2a").update({
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

/*
    it("Import dockerhub image", async () => {
        const i = await Images.document().dockerhub.import({
            name: "Test Image",
            about: {
                description: "This is a test image"
            },
            repo: "cycleplatform/website-daemon",
            tag: ":latest"
        });
        if (!i.ok) {
            throw new Error(i.error.detail || i.error.title);
        }
    });
});
*/


//========================================================================================================================

/*
describe("Containers:", () => {

    it("Verifies that data is an array", async () => {
        const c = await Containers.document().get({
        page: {
            number: 1,
            size: 2
        }
        
    });
        const cstring = JSON.stringify(c);
        console.log(cstring);
        if (!c.ok) {
            throw new Error(c.error.title);
        }

        if (c.value.data instanceof Array) {
            return;
        } else {
            throw new Error("Data is not an array");
        }

    });
*/
/*
    it("Gets a single container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").get();
        if (!c.ok) {
            throw new Error(c.error.title);
        }

    });
*/
/*
    it("Creates a container", async () => {
        const c = await Containers.document().create({
            name: "Created Container",
            environment: "5849daff1b847a3e7bb3c9fb",
            config: {
                flags: {auto_restart: true},
                tls: {
                    enabled: true,
                    path: "/tls"
                },
                dnsrecord: ""
            },
            plan: "5612c19b58f23b6c0ec6df55",
            image: "584a23b41b847a3e7   bb3ca2b",
            scaling: {
                method: "persistent",
                hostname: "testcontainer",
                persistent: {
                    datacenter: "564a202c58f2213ab004c75a",
                    public_interface: true
                }
            },
            volumes: [
                {
                    id: "",
                    volume_plan: "56ca412958f26052f5293473",
                    path: "/data",
                    remote_access: true
                }
            ]
        });
        if (!c.ok) {
            throw new Error(c.error.detail);
        }
    });
*/
/*
    it("Updates container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").update({
            name: "Update Container",
            volumes: [
                {
                    id: "584a3ed51b847a3e7bb3ca3e",
                    remote_access: false
                }
            ]
        });
        if (!c.ok) {
            throw new Error(c.error.detail);
        }
    });
*/

/*
    it("Deletes container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").delete();
        if (!c.ok) {
            throw new Error(c.error.title);
        }
    });
*/ 
/* 
    it("Starts container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").start();
        if (!c.ok) {
            throw new Error(c.error.title);
        }
    });
*/
/*
    it("Stops container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").stop();
        if (!c.ok) {
            throw new Error(c.error.title);
        }
    });
*/
/*
    it("Modify container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").apply({
                plan: "5612bbbc58f23b6c0ec6df53",
                domain: null,
                hostname: "ApplyContainer",
                runtime: {
                    env_vars: {
                        FILE_DIR: "/data/files",
                        PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                        PUBLIC_DIR: "/data/public",
                        ROUTES_CONFIG: "/data/routes.json",
                        TEST: "/test",
                        TLS_DIR: "/tls"
                    }
                },
                tls: {
                    enabled: true,
                    path: "/tls"
                },
                flags: {auto_restart: false}
            
        });
        if (!c.ok) {
            throw new Error(c.error.detail || c.error.title);
        }
        console.log(c.value);
    });
*/
/*
    it("Reimage container", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").reimage({
            image: "584a6c391b847a3e7bb3ca82"
        });
        if (!c.ok) {
            throw new Error(c.error.title);
        }
    });
*/
/*
    it("Gets compatible container image", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").compatibleImages();
        if (!c.ok) {
            throw new Error(c.error.title);
        }
    });

*/
/*
    it("Retrieves instances", async () => {
        const c = await Containers.document("584a3ed51b847a3e7bb3ca3f").instances("584a3ee055d8ff712ec2974a").log("startup_process_first").get();
        if (!c.ok) {
            throw new Error(c.error.title);
        }
        console.log(c.value);
    });
});
*/
/*
describe("Datacenter:", async () => {

    it("Retrieves Datacenters", async () => {
        const d = await DataCenters.document().get();
        if (!d.ok) {
            throw new Error(d.error.title);
        }
        console.log(d.value);
    });
*/
/*
    it("Retrieves a Datacenters", async () => {
        const d = await DataCenters.document("57b6155aa7c87b39627d8033").get();
        if (!d.ok) {
            throw new Error(d.error.title);
        }
        console.log(d.value);
    });
});
*/
/*
describe("Plans:", async () => {

    it("Retrieves Plans", async () => {
        const p = await Plans.document().get();
        if (!p.ok) {
            throw new Error(p.error.title);
        }
        console.log(p.value);
    });
*/
/*
    it("Retrieves a Datacenters", async () => {
        const d = await Plans.document("5612c1e158f23b6c0ec6df59").get();
        if (!d.ok) {
            throw new Error(d.error.title);
        }
        console.log(d.value);
    });

});
*/

/*
describe("Volumes:", async () => {

    it("Retrieves Volumes", async () => {
        const p = await Plans.Volumes.document().get();
        if (!p.ok) {
            throw new Error(p.error.title);
        }
        console.log(p.value);
    });
});
*/

describe("Jobs:", async () => {
/*
    it("Retrieves Jobs", async () => {
        const j = await Jobs.document().get();
        if (!j.ok) {
            throw new Error(j.error.title);
        }
        console.log(p.value);
    });
*/
        it("Retrieves a Job", async () => {
        const j = await Jobs.document("57dc25ad1b847a549ce7040d").get();
        if (!j.ok) {
            throw new Error(j.error.detail);
        }
        console.log(j.value);
    });
});
