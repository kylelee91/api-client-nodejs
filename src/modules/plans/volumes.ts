import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    ResourceId,
    Resource,
    QueryParams,
} from "../../common/structures";

export function document() {
    return VolumeRequest;
}

export interface Collection extends CollectionDoc {
    data: Volume[];
}

export interface Single extends SingleDoc {
    data: Volume | null;
}

export interface Volume extends Resource {
    id: ResourceId;
    type: "volume_plan";
    attributes: {
        name: string;
        local: boolean;
        price: {
            month: number;
        };

        public: boolean;
        resources: {
            storage: number;
        };
        type: string;
    };
}

export class VolumeRequest {
    public static async get(query?: QueryParams) {
        return API.get<Collection>("plans/volumes", query);
    }
}
