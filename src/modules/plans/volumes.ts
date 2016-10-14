// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id } from "../../common/structures";

export function document() {
    return VolumeRequest;
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
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
    public static async get(query?: API.QueryParams) {
        return API.get<Collection>("plans/volumes", query);
    }
}
