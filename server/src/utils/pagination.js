import { DEFAULT_PAGE_SIZE } from "../constants/common.js";

/**
 * Builds pagination parameter.
 *
 * @param {object} params
 * @returns {PaginationParams}
 */
export function buildPageParams(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(url.searchParams.get("page"), DEFAULT_PAGE_SIZE) || 1;
    const size = parseInt(url.searchParams.get("size"), DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE;

    return {
        page: Math.max(page, 1),  
        size: Math.max(size, 1) 
    };
}

export function getMeta(total, size) {
    return {
        page: Math.ceil(total / size),
        size,
        total
    };
}

export function injectPaginationToQuery(query) {
    return `${query} size ? OFFSET ?`;
}

