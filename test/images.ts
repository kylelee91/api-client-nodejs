import { Images, Utils } from "../src";
import { assert } from "chai";

export async function dockerImport(repo: string) {
    const imageName = "Test Image";
    const imageDescription = "Test Description";
    const imageRepo = repo;
    const imageTag = "latest";
    const image = {
        name: imageName,
        about: {
            description: imageDescription
        },
        repo: imageRepo,
        tag: imageTag
    };

    const resp = await Images.document().dockerhub.import({
        name: image.name,
        about: {
            description: image.about.description
        },
        repo: image.repo,
        tag: image.tag
    });

    if (!resp.ok) {
        throw new Error("It failed to import an image from dockerhub.");
    }
    if (!resp.value.data) {
        throw new Error("The data for importing an image is null.");
    }

    // assert.equal(image.name, resp.value.data.name, "The image name does not match the name used to import");
    // assert.equal(image.about.description, resp.value.data.about.description,
    //     "The image description does not match the description used to import image");
    // assert.equal(image.repo, resp.value.data.source.repo, "The image repo does not match the repo used to import");
    // assert.equal(image.tag, resp.value.data.source.tag, "The image tag does not match the tag used to import");

    return resp.value;
}

export async function build(img: Images.Single | undefined) {
    if (!img || !img.data) {
        throw new Error("An existing image  wasn't set. You must use an existing image.")
    }

    const resp = await Images.document(img.data.id).build();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: build image.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }
    if (jobResp.value.data.state.current === "error") {
        if (jobResp.value.data.state.error) {
            throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
        }
        throw new Error(`Job build failed and no error block was specified`);
    }
};

export async function update(img: Images.Single | undefined) {
    if (!img || !img.data) {
        throw new Error("An existing image wasn't set. You must use an existing image.")
    }
    const updateName = "Update Image";
    const updateDescription = "Update Description";
    const image = {
        name: updateName,
        about: {
            description: updateDescription
        }
    };

    const resp = await Images.document(img.data.id).update({
        name: image.name,
        about: {
            description: image.about.description
        }
    });

    if (!resp.ok) {
        throw new Error("It failed to update an image.");
    }

    if (!resp.value.data) {
        throw new Error("The data for updating an image is null.");
    }

    assert.equal(image.name, resp.value.data.name, "The updated image name does not match the name used to update");
    assert.equal(image.about.description, resp.value.data.about.description,
        "The updated image description does not match the description used to update")
}

export async function del(img: Images.Single | undefined) {
    if (!img || !img.data) {
        throw new Error("An existing image wasn't set. You must use an existing image.")
    }

    const resp = await Images.document(img.data.id).delete();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: delete image.");
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

export async function deleteUnused() {
    const resp = await Images.document().deleteUnused();
    if (!resp.ok) {
        throw new Error("It failed to delete unused image.");
    }
    if (!resp.value.data) {
        throw new Error("The data for deleting unused images is null.");
    }
};

export async function getSingle() {
    let id: string | undefined;

    const img = await dockerImport("cycleplatform/website-daemon");
    if (!img.data) {
        throw new Error("An existing image wasn't set. You must use an existing image.");
    }

    id = img.data.id;
    const resp = await Images.document(id).get();

    if (!resp.ok) {
        throw new Error("It failed to get a single image.");
    }

    if (!resp.value.data) {
        throw new Error("The data for getting a single image is null.");
    }
    assert.deepEqual(img.data, resp.value.data, "The response from get does not match the response expected.");

    return img;
};

async function runImageTestImport(repo: string) {
    let img: Images.Single | undefined;

    before("Import", async () => {
        if (!img) {
            img = await dockerImport(repo);
        }
    });

    it(`Build ${repo}`, async () => {
        await build(img);
    });

    it(`Update ${repo}`, async () => {
        await update(img);
    });

    after(`Delete ${repo}`, async () => {
        await del(img);
    });
    return img;
}

describe("Testing Images", async () => {
    describe("Import, Build, Update, and Delete", async () => {
        await Promise.all([
            runImageTestImport("cycleplatform/website-daemon"),
            runImageTestImport("cycleplatform/minecraft")
        ]);
    });

    describe("Delete unused images", async () => {
        before("Import image", async () => {
            await Promise.all([
                dockerImport("cycleplatform/website-daemon"),
                dockerImport("cycleplatform/minecraft")
            ]);
        });
        it("Delete", async () => {
            await deleteUnused();
        });
    });

    // describe("Deleted image", async () => {
    //     let img: Images.Single | undefined;
    //     before("Import", async () => {
    //         img = await dockerImport("cycleplatform/website-daemon");
    //         await del(img);
    //     });
    //     it("Delete", () => {
    //         return del(img).then((resp) => {
    //             throw Error("Deleted a deleted image");
    //         }, () => {/* */});
    //     });

    //     it("Update", () => {
    //         return update(img).then((resp) => {
    //             throw Error("Updated a deleted image");
    //         }, () => {/* */});
    //     });

    //     it("Build", () => {
    //         return build(img).then((resp) => {
    //             throw Error("Built a deleted image");
    //         }, () => {/* */});
    //     });
    // });

    // describe("Imports image and checks response from get", async () => {
    //     let img: Images.Single | undefined;
    //     it("Get", async () => {
    //         img = await getSingle();
    //         return img;
    //     });

    //     after("Deletes image", async () => {
    //         await del(img);
    //     });
    // }); 
});
