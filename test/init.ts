import "mocha";
import {
    Environments,
    Containers,
    Settings,
    Images,
    Auth,
    DataCenters,
    Plans,
    Jobs,
    Repos,
    Dns,
    Billing,
    Accounts,
    Tiers

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
/*
describe("Jobs:", async () => {

    it("Retrieves Jobs", async () => {
        const j = await Jobs.document().get();
        if (!j.ok) {
            throw new Error(j.error.title);
        }
        console.log(p.value);
    });

        it("Retrieves a Job", async () => {
        const j = await Jobs.document("57dc25ad1b847a549ce7040d").get();
        if (!j.ok) {
            throw new Error(j.error.detail);
        }
        console.log(j.value);
    });
});
*/
/*
describe("Repos:", async () => {

    it ("Retrieves a collection of repos", async () => {
        const r = await Repos.document().get();
        if (!r.ok) {
            throw new Error(r.error.detail);
        }
        console.log(r.value);
    });
*/
/*
    it ("Retrieves a single repo", async () => {
        const r = await Repos.document("583fcf341b847a65e05aacab").get();
        if (!r.ok) {
            throw new Error(r.error.detail);
        }
        console.log(r.value);
    });
*/
/*
    it ("Creates a repo", async () => {
        const r = await Repos.document().create({
            name: "Create Repo",
            url: "git@github.com:kylelee91/test.git",
            type: "git",
            auth: {
                private_key: "-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----"
            }
        });
        if (!r.ok) {
            throw new Error(r.error.detail);
        }
        console.log(r.value);
    });
*/
/*
    it ("Updates repo", async () => {
        const r = await Repos.document("584fafaf593b673bad36a02b").update({
            name: "Update Repo",
            url: "git@github.com:update/test.git",
            auth: {
                private_key: "PRVT_KEY_HERE"
            }
        });

    });
*/
/*
    it ("Build repo", async () => {
        const r = await Repos.document("584fbed2593b673bad36a03a").build({
                latest: true,
                commit: "",
                description: ""
        });
    });
});
*/
/*
describe("DNS Zones:", async () => {

    it ("Retrieves a collection of zones", async () => {
        const z = await Dns.Zones.document().get();
        if (!z.ok) {
            throw new Error(z.error.detail || z.error.title);
        }
        console.log(z.value);
    });
*/
/*
    it ("Creates a dns zone", async () => {
        const z = await Dns.Zones.document().create({
            origin: "example.com"
        });
    });
*/
/*
    it ("Retrieves a single dns zone", async () => {
        const z = await Dns.Zones.document("585059fb593b673bad36a079").get();
        if (!r.ok) {
            throw new Error(z.error.detail || z.error.title);
        }
        console.log(z.value);
    });
    */
 /*   
    it ("Updates a single dns zone", async () => {
        const z = await Dns.Zones.document("583356941b847a68d486ebad").update({
            origin: "Update.com",
        });
        if (!z.ok) {
            throw new Error(z.error.detail || z.error.title);
        }
        console.log(z.value);
    });
*/
/*
    it ("Verifies a dns zone", async () => {
        const z = await Dns.Zones.document("585059fb593b673bad36a079").verify();
        if (!z.ok) {
            throw new Error(z.error.detail || z.error.title);
        }
        console.log(z.value);
    });
});
*/
/*
    it ("Deletes a dns zone", async () => {
        const z = await Dns.Zones.document("585059fb593b673bad36a079").delete();
        if (!z.ok) {
            throw new Error(z.error.detail || z.error.title);
        }
        console.log(z.value);
    });
});
*/
/*
describe("DNS Records:", async () => {

    it ("Retrieves a collection of records", async () => {
        const r = await Dns.Zones.document("").records().get();
        if (!r.ok) {
            throw new Error(r.error.detail || r.error.title);
        }
        console.log(r.value);
    });
*/

/*
    it ("Creates a DNS record", async () => {
        const r = await Dns.Zones.document("583356941b847a68d486ebad").records().create({
            type: "a",
            assignable: true,
            name: "create",
            values: {
                ip: ""
            }
        });
        if (!r.ok) {
            throw new Error(r.error.detail || r.error.title);
        }
        console.log(r.value);
    });
*/
/*
    it ("Retrieves a single record", async () => {
        const r = await Dns.Zones.document("583356941b847a68d486ebad").records("583a42ee1b847a76ec4c754f").get();
        if (!r.ok) {
            throw new Error(r.error.detail || r.error.title);
        }
        console.log(r.value);
    });
*/
/*
    it ("Retrieves a single record", async () => {
        const r = await Dns.Zones.document("583356941b847a68d486ebad").records("583a466d1b847a76ec4c7559").delete();
        if (!r.ok) {
            throw new Error(r.error.detail || r.error.title);
        }
        console.log(r.value);
    });
    */
/*
    it ("Updates a single record", async () => {
        const r = await Dns.Zones.document("583356941b847a68d486ebad").records("58507f66593b674d07deb34d").update({
            type: "aaaa",
            assignable: true,
            name: "Update",
            values: {
                ip: "2001:cdba:0000:0000:0000:0000:3257:9652"
            }
        });
        if (!r.ok) {
            throw new Error(r.error.detail || r.error.title);
        }
        console.log(r.value);
    });
*/
/*
    it ("Retrieves a record domain", async () => {
        const r = await Dns.Records.domains();
        if (!r.ok) {
            throw new Error(r.error.detail || r.error.title);
        }
        console.log(r.value);
    });
});
*/

////////////////////////////////////////////////////////////////////////
/*
describe("Billing:", async () => {

    it ("Gets a collection of invoices", async () => {
        const b = await Billing.Invoices.document().get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });
*/
/*
    it ("Gets a single invoice", async () => {
        const b = await Billing.Invoices.document("5853371e79f2ca5fe6aece55").get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });
*/
/*
    it ("Gets a collection of invoices", async () => {
        const b = await Billing.Credits.document().get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });
*/
/*
    it ("Gets a current services", async () => {
        const b = await Billing.Services.document().get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });
*/
/*
    it ("Gets expected", async () => {
        const b = await Billing.Expected.document().get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });
});
*/
////////////////////////////////////////////////////////////
/*
describe("Accounts:", async () => {

        it ("Retrieves account", async () => {
        const a = await Accounts.document().get();
        if (!a.ok) {
            throw new Error(a.error.detail || a.error.title);
        }
        console.log(a.value);
    });
*/
/*
        it ("Updates account", async () => {
        const a = await Accounts.document().update({
            name: {
                first: "Kyle",
                last: "Lee"
            },
            position: "",
            auth: {
                allow_employee_login: true
            }
        });
        if (!a.ok) {
            throw new Error(a.error.detail || a.error.title);
        }
        console.log(a.value);
    });
*/
/*
        it ("Updates password", async () => {
        const a = await Accounts.document().changePassword({
            current: "CurrentPassword",
            new: "NewPassword"
        });

        if (!a.ok) {
            throw new Error(a.error.detail || a.error.title);
        }
        console.log(a.value);
    });
*/
/*
        it ("Retrieve accounts", async () => {
        const a = await Accounts.document().lookup({
            filter: {
                search: "kyl"
            }
        });

        if (!a.ok) {
            throw new Error(a.error.detail || a.error.title);
        }
        console.log(a.value);
    });
});
*/
/////////////////////////////////////////////////////////////////
/*
describe("Tiers:", async () => {
    it ("Gets a collection of tiers", async () => {
        const b = await Tiers.document().get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });
*/
/*
    it ("Gets a single tier", async () => {
        const b = await Tiers.document("574d2aea1c4568c6f3aaf8d0").get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });

});
*/
/////////////////////////////////////////////////////////////////

describe("Datacenters:", async () => {

});
