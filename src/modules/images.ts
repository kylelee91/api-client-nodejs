import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, State, Events, Task, FormattedDoc } from "../common/structures";

export function document(): typeof ImagesRequest;
export function document(id: string): ImageRequest;
export function document(id?: string): typeof ImagesRequest | ImageRequest {
    if (!id) {
        return ImagesRequest;
    }

    return new ImageRequest(id);
}

export interface ImageCollection extends JsonApi.CollectionDocument {
    data: ImageResource[];
}

export interface Image extends JsonApi.ResourceDocument {
    data: ImageResource | null;
}

export type ImageState =
    "new"
    | "claimed"
    | "downloading"
    | "building"
    | "verifying"
    | "saving"
    | "live"
    | "deleting"
    | "deleted"
    | "error";
export interface ImageResource extends JsonApi.Resource {
    id: Id;
    type: "images";
    attributes: {
        name: string;
        about: {
            description: string;
        };
        source: {
            flavor: string;
            type: string;
            target: string;
            repo: string;
            tag: string;
        };
        tags: string[];
        size: number;
        config: ImageConfig;
        state: State<ImageState>;
        events: Events;
    };

    relationships?: {
        team: JsonApi.ToOneRelationship;
        repo: JsonApi.ToOneRelationship;
    };

    meta: {
        counts: {
            containers: number;
        };
    };
}

export interface ImageConfig {
    hostname: string;
    user: string;
    env: { [key: string]: string };
    labels: { [key: string]: string };
    ports: ImageConfigPort[];
    command: string[];
    entrypoint: string[];
    volumes: ImageConfigVolume[];
}

export interface ImageConfigPort {
    type: string;
    number: number;
}

export interface ImageConfigVolume {
    path: string;
    mode: number;
}

export interface ImageCreateParams {

}

export interface DockerHubImportParams {
    name: string; // >4 chars
    about?: {
        description: string;
    };
    repo: string;
    tag: string;
    auth?: {
        require: boolean;
        username: string;
        password: string;
        email: string;
        server: string;
    };
};

export interface UpdateImageParams {
    name?: string;
    about?: {
        description: string;
    };
}

export type ImageCollectionActions = "cleanup";
export class ImagesRequest {
    private static target = "images";

    public static async get(query?: ApiRequest.QueryParams): Promise<ImageCollection> {
        return ApiRequest._get<ImageCollection>(this.target, query);
    }

    public static async create(doc: ImageCreateParams, query?: ApiRequest.QueryParams): Promise<Image> {
        return ApiRequest._post<Image>(this.target, new FormattedDoc({ type: "images", attributes: doc }), query);
    }

    public static async deleteUnused() {
        return ApiRequest._post<Task<ImageCollectionActions>>(`${this.target}/tasks`, new Task("cleanup"));
    }

    public static dockerhub() {
        return {
            import: async (doc: DockerHubImportParams, query?: ApiRequest.QueryParams): Promise<Image> => {
                return ApiRequest._post<Image>(`${this.target}/dockerhub`, new FormattedDoc({ type: "images", attributes: doc }), query);
            }
        };
    }
}

export type ImageActions = "build";
export class ImageRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `images/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams) {
        return ApiRequest._get<Image>(this.target, query);
    }

    public async update(doc: UpdateImageParams, query?: ApiRequest.QueryParams): Promise<Image> {
        return ApiRequest._patch<Image>(this.target, new FormattedDoc({ id: this.id, type: "images", attributes: doc }), query);
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Task<ImageActions>> {
        return ApiRequest._delete<Task<ImageActions>>(this.target, query);
    }

    public async build() {
        return this.tasks().create("build");
    }

    public tasks() {
        return {
            create: async (action: ImageActions, contents?: Object): Promise<Task<ImageActions>> => {
                return ApiRequest._post<Task<ImageActions>>(`${this.target}/tasks`, new Task(action, contents));
            }
        };
    }
}

