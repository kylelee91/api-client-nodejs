import { ApiResult } from "../common/api";
import { QueryParams, ResourceId } from "../common/structures";
import * as Jobs from "../modules/jobs";
// tslint:disable-next-line:no-unused-variable
import { Single } from "../modules/jobs";

/**
 * Interface describing function called on progress event
 */
export interface JobProgressCallback {
    (j: Jobs.Single): void;
}

/**
 * Interface describing optional function to be called instead of 
 * job fetch from API. Useful if client is using
 * a refresh token handler or something similar
 */

export interface FetchJobCallback {
    (query?: QueryParams): Promise<ApiResult<Jobs.Single>>;
}


export interface JobTrackerSettings {
    id: ResourceId;
    onProgress?: JobProgressCallback;
    fetchJob?: FetchJobCallback;

    /**
     * Milliseconds to delay between calls to job
     * TODO - remove when switching to websockets
     */
    delay?: number;
}

/**
 * Awaitable job tracking with optional progress callback
 */
export async function jobToComplete(s: JobTrackerSettings) {
    const { id, onProgress, delay } = s;
    const jobFunc = () => Jobs.document(id).get();
    let callback = s.fetchJob || jobFunc;
    let resp = await callback();

    if (!resp.ok || !resp.value.data) {
        return resp;
    }

    while (["new", "running", "queued"].indexOf(resp.value.data.state.current) > -1) {
        // wait for delay or 2 seconds
        await new Promise(res => setTimeout(() => res(), delay || 2000));
        resp = await callback();

        if (!resp.ok || !resp.value.data) {
            return resp;
        }

        if (onProgress) {
            onProgress(resp.value);
        }
    }

    return resp;
}


/**
 * USAGE
 */
async function test() {
    const jresp = await jobToComplete({
        id: "abc", // -> ID of Job (usually from task)
        onProgress: j => { // Function called on every update cycle
            console.log("JOB UPDATED", j);
        }
    });

    /**
     * Only gets here if job state is not new, running, or queued.
     * Cycle is no longer working on the job and no
     * more updated will be made
     */
    if (jresp.ok) {
        const { value: job} = jresp;

        // Make sure data isn't null
        if (!job.data) {
            return;
        }

        // Utilize job here
        console.log(job.data.state.current);
    }
}
