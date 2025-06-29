import { ObjectValues } from "types/utils-type";

export const BUCKET_NAME = "mygeslike";

export const BUCKET_DESTINATION = {
    PROJECT: "projects",
    DELIVERABLE: "deliverables",
} as const;

export type BucketDestination = ObjectValues<typeof BUCKET_DESTINATION>;
