import { create as createEnvironment, del as deleteEnvironment } from "./environments";
import { dockerImport, build, deleteUnused, del as deleteImage } from "./images";
import { Containers, Environments, Images, Utils, Structures } from "../src";
import { assert } from "chai";

interface ResourceType {
    type: "container" | "environment" | "image";
    doc: Structures.SingleDoc;
}

export async function create(): Promise<ResourceType[]> {
    const img = await dockerImport("cycleplatform/website-daemon");

    if (!img.data) {
        throw new Error("The data for importing image is null.");
    }

    await build(img);

    const env = await createEnvironment();

    if (!env.data) {
        throw new Error("The data for creating environment is null.");
    }

    const contResp = await Containers.document().create({
        name: "Create Container",
        environment: env.data.id,
        config: {
            flags: { auto_restart: true },
            tls: {
                enabled: true,
                path: "/tls"
            },
            dnsrecord: "",
            hostname: "create-container",
            scaling: {
                method: "persistent",
                persistent: {
                    datacenter: "564a202c58f2213ab004c75a",
                    public_interface: true
                }
            }
        },
        plan: "5612c19b58f23b6c0ec6df55",
        image: img.data.id,
        volumes: [
            {
                id: "",
                volume_plan: "56ca412958f26052f5293473",
                path: "/data",
                remote_access: true
            }
        ]
    });

    if (!contResp.ok) {
        throw new Error("It failed to create a container.");
    }

    if (!contResp.value.data) {
        throw new Error("The data for creating a container is null.");
    }

    return [
        {
            type: "container", doc: contResp.value
        },
        {
            type: "environment", doc: env
        },
        {
            type: "image", doc: img
        }
    ];
};

export async function update(cont: Containers.Single) {
    if (!cont.data) {
        throw new Error("The data for updating container is null.");
    }
    const contName = "Update Container";
    const contVolumeID = cont.data.volumes[0].id;
    const contVolumeRemoteAccess = false;
    const updateCont = {
        name: contName,
        volumes: [
            {
                id: contVolumeID,
                remote_access: contVolumeRemoteAccess
            }
        ]
    };

    const resp = await Containers.document(cont.data.id).update({
        name: updateCont.name,
        volumes: [{
            id: updateCont.volumes[0].id,
            remote_access: updateCont.volumes[0].remote_access
        }]
    });

    if (!resp.ok) {
        throw new Error("Updating a container has failed because a structure wasn't returned.");
    }

    if (!resp.value.data) {
        throw new Error("The data for updating container is null.");
    }

    assert.equal(updateCont.name, resp.value.data.name, "The container updated does not match the name used to update container");
    assert.equal(updateCont.volumes[0].id, resp.value.data.volumes[0].id,
        "The container updated does not match the volume ID used to update container");
    assert.equal(updateCont.volumes[0].remote_access, resp.value.data.volumes[0].remote_access,
        "The container updated does not match the remote access used to update container");
};

export async function del(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const resp = await Containers.document(cont.data.id).delete();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: delete container.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }

    if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
        throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
    }
};

export async function deleteResource(...docs: ResourceType[]) {
    for (let k in docs) {
        const d = docs[k];
        switch (d.type) {
            case "environment":
                await deleteEnvironment(<Environments.Single>d.doc);
                break;
            case "image":
                await deleteImage(<Images.Single>d.doc);
                break;
            case "container":
                await del(<Containers.Single>d.doc);
                break;
            default:
        }
    }
};

export async function compareContainer(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const resp = await Containers.document(cont.data.id).get();

    if (!resp.ok) {
        throw new Error("Getting a container has failed because a structure wasn't returned.");
    }

    if (!resp.value.data) {
        throw new Error("The data for getting a single container is null.");
    }

    assert.deepEqual(cont.data, resp.value.data, "The response from get does not match the response expected.");

};

export async function taskUpdate(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const contUpdate = {
        plan: "5612c19b58f23b6c0ec6df55",
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
        flags: { auto_restart: true }
    };

    const resp = await Containers.document(cont.data.id).apply(contUpdate);

    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: update container.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }

    if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
        throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
    }
    console.log(resp.value.data);
    await compareContainer(cont);

};

export async function start(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const resp = await Containers.document(cont.data.id).start();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: start container.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }

    if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
        throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
    }

}

export async function stop(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const resp = await Containers.document(cont.data.id).stop();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: stop container.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }

    if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
        throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
    }

}

export async function getCompatibleImage(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const resp = await Containers.document(cont.data.id).compatibleImages({ "sort": ["-id"] });
    if (!resp.ok) {
        throw new Error("Retrieving compatable image for a container has failed because a structure wasn't returned.");
    }

    if (!resp.value.data) {
        throw new Error("The data for retrieving compatible image is null.");
    }

    return resp;
};

export async function reimageContainer(cont: Containers.Single) {
    if (!cont || !cont.data) {
        throw new Error("An existing container wasn't set. You must use an existing container.");
    }

    const testImage = await dockerImport("cycleplatform/website-daemon");
    await build(testImage);

    const imageList = await getCompatibleImage(cont);
    if (!imageList.ok || !imageList.value.data) {
        throw new Error("Retrieving compatible image list failed.");
    }

    if (imageList.value.data.length) {
        const resp = await Containers.document(cont.data.id).reimage({ "image": imageList.value.data[0].id });
        if (!resp.ok || !resp.value.data.job) {
            throw new Error("It failed to create job: stop container.");
        }

        const jobResp = await Utils.jobToComplete({
            id: resp.value.data.job
        });

        if (!jobResp.ok || !jobResp.value.data) {
            throw new Error("Getting job failed");
        }

        if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
            throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
        }
    }
}

describe("Test Containers", async () => {
    // describe("Create, Get, Update, and  Delete Container", async () => {
    //     let results: ResourceType[];
    //     before("Create", async () => {
    //         results = await create();
    //     });
    //     it("Get", async () => {
    //         await compareContainer(<Containers.Single>results[0].doc);
    //     });
    //     it("Update", async () => {
    //         await update(<Containers.Single>results[0].doc);
    //     });

    //     after("Delete", async () => {
    //         await deleteResource(...results);
    //     });
    // });

    // describe("Update Via Task", async () => {
    //     let results: ResourceType[];
    //     before("Create", async () => {
    //         results = await create();
    //     });
    //     it("Update via task", async () => {
    //         await taskUpdate(<Containers.Single>results[0].doc);
    //     });
    //     after("Delete", async () => {
    //         await deleteResource(...results);
    //     });
    // });

    // describe("Start/Stop Container", async () => {
    //     let results: ResourceType[];
    //     before("Create", async () => {
    //         results = await create();
    //     });
    //     it("Start", async () => {
    //         await start(<Containers.Single>results[0].doc);
    //     });
    //     it("Stop", async () => {
    //         await stop(<Containers.Single>results[0].doc);
    //     });
    //     after("Delete", async () => {
    //         await deleteResource(...results);
    //     });
    // });

    describe("Reimage Container Image", async () => {
        let results: ResourceType[];
        before("Create", async () => {
            results = await create();
        });
        it("Start", async () => {
            await start(<Containers.Single>results[0].doc);
        });
        it("Reimage", async () => {
            await reimageContainer(<Containers.Single>results[0].doc);
        });
        it("Stop", async () => {
            await stop(<Containers.Single>results[0].doc);
        });
        after("Delete", async () => {
            await deleteResource(...results);
            await deleteUnused();
        });
    });
});

