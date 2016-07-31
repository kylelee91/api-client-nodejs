//Response Document
export interface TopLevel {
    //http://jsonapi.org/format/#document-top-level
    jsonapi?: {[key: string]: string};

    links?: TopLinks;
    
    meta?: {[key: string]: Meta};

    included?: Resource[];
}

export type Document = CollectionDocument | ResourceDocument;

export interface CollectionDocument extends TopLevel {
    data: Resource[];
    
}

export interface ResourceDocument extends TopLevel {
    data: Resource | null;
    
    included?: Resource[];
}

//Resource
export interface ResourceIdentifier {
    id?: string;

    type: string;
}

export interface Resource extends ResourceIdentifier {
    attributes?: {[key: string]: any};

    relationships?: {[key: string]: Relationship; };

    links?: Links;

    meta?: Meta;
}


//Relationships
export interface Relationship {
    data?: ResourceIdentifier[] | ResourceIdentifier | null;

    links?: {
        self?: Link;
        related?: Link;
    };

    meta?: Meta;
}

export interface ToManyRelationship extends Relationship {
    data?: ResourceIdentifier[] ;
}

export interface ToOneRelationship extends Relationship {
    data: ResourceIdentifier | null;
}

// Attributes
export interface Attributes {
    [key: string]: any;
}

//Links
export interface Links {
    [key: string]: Link;
}

export interface TopLinks extends Pagination {
    self?: Link;
    related?: Link;
}

export type Link = string | LinkObject;

export interface LinkObject {
    href?: string;
    meta?: {[key: string]: Meta};
}

//Meta
export interface Meta {
    [key: string]: any;
}

//Pagination
export interface Pagination {
    first: Link;

    last: Link;

    prev: Link;

    next: Link;
}

//Errors
export interface ErrorDocument extends TopLevel {
    errors: ErrorDetail[];
}

export interface ErrorDetail {
    id?: string;

    links?: {
        about: Link
    };

    status?: string;

    code?: string;

    title?: string;

    detail?: string;

    source?: {
        pointer?: string;

        parameter?: string;
    };

    meta?: {
        [key: string]: string;
    };
}
