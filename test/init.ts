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
    Tiers,
    Notifications,
    Teams

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
<<<<<<< Updated upstream

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


describe("Containers:", () => {
/*
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
            environment: "586eb60a593b671053527991",
            config: {
                flags: {auto_restart: true},
                tls: {
                    enabled: true,
                    path: "/tls"
                },
                dnsrecord: "",
                hostname: "test-cont",
                scaling: {
                method: "persistent",
                persistent: {
                    datacenter: "564a202c58f2213ab004c75a",
                    public_interface: true
                }
            }
            },
            plan: "5612c19b58f23b6c0ec6df55",
            image: "586d56a6593b676942797722",
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


    it("Updates container", async () => {
        const c = await Containers.document("586eba1c593b6710535279c0").update({
            name: "Update Container",
            volumes: [
                {
                    id: "586ebb3b593b6710535279c7",
                    remote_access: false
                }
            ]
        });
        if (!c.ok) {
            throw new Error(c.error.detail);
        }
    });
});

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


describe("Jobs:", async () => {

    it("Retrieves Jobs", async () => {
        const j = await Jobs.document().get();
        if (!j.ok) {
            throw new Error(j.error.title);
        }
        console.log(j.value);
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


    it ("Retrieves a single repo", async () => {
        const r = await Repos.document("583fcf341b847a65e05aacab").get();
        if (!r.ok) {
            throw new Error(r.error.detail);
        }
        console.log(r.value);
    });
});
*/
/*
    it ("Creates a repo", async () => {
        const r = await Repos.document().create({
            name: "Create Repo",
            url: "git@github.com:kylelee91/test.git",
            type: "git",
            auth: {
                private_key:
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
        if (!z.ok) {
            throw new Error(z.error.detail || z.error.title);
        }
        console.log(z.value);
    });
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
        const r = await Dns.Zones.document("5851d791593b674d07deb44d").records().get();
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
    it ("Deletes a single record", async () => {
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


    it ("Gets a current services", async () => {
        const b = await Billing.Services.document().get();
        if (!b.ok) {
            throw new Error(b.error.detail || b.error.title);
        }
        console.log(b.value);
    });


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
