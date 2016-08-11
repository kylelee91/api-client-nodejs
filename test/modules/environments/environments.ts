import config from "../common/config";
import * as CycleApi from "../../../src/index";
import "mocha";

describe("Images", () => {
    let imgPromise: Promise<CycleApi.Images.Image>;
    beforeEach(config);
    it("Create Image", () => {
        imgPromise = CycleApi.Images.document().dockerhub().import({
            name: "Test Image",
            repo: "busybox",
            tag: "latest"
        });
        return imgPromise;
    });
    it("Build Image", () => {
        if (!imgPromise) {
            throw new Error("No image found");
        }
        return imgPromise.then((img) => {
            if (!img.data) {
                throw new Error("No image found");
            } else {
                return CycleApi.Images.document(img.data.id).tasks().create("build");
            }
        });
    });
    describe("Environments", () => {
        let envPromise: Promise<CycleApi.Environments.Environment>;
        it("Get a list of environments", () => {
            return CycleApi.Environments.document().get();
        });

        it("Create an environment", () => {
            envPromise = CycleApi.Environments.document().create({
                name: "Test Env",
                about: {
                    description: "Testing Environment Creation"
                }
            });
            return envPromise;
        });

        it("Get environment", () => {
            if (!envPromise) {
                throw new Error("No environment found");
            }
            return envPromise.then((env) => {
                if (env && env.data) {
                    return CycleApi.Environments.document(env.data.id);
                } else {
                    throw new Error("Environment not found");
                }
            });
        });

        it("Delete environment", () => {
            if (!envPromise) {
                throw new Error("No environment found");
            }
            return envPromise.then((env) => {
                if (env && env.data) {
                    return CycleApi.Environments.document(env.data.id).delete();
                } else {
                    throw new Error("Environment not found");
                }
            });
        });

        it("Delete image", () => {
            return imgPromise.then((img) => {
                if (img && img.data) {
                    return CycleApi.Images.document(img.data.id).delete();
                } else {
                    throw new Error("Image not found");
                }
            });
        });
    });
});
