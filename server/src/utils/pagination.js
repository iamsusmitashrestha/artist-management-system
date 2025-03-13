import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/common.js";

/**
 * Builds pagination parameter.
 *
 * @param {object} params
 * @returns {PaginationParams}
 */
export function buildPageParams(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const page = parseInt(url.searchParams.get("page")) || DEFAULT_PAGE;
  const size = parseInt(url.searchParams.get("size")) || DEFAULT_PAGE_SIZE;

  return {
    page,
    size,
  };
}

export function getMeta(page, size, count) {
  return {
    page,
    size,
    total: count,
  };
}

export function injectPaginationToQuery(query, page, size) {
  const offset = (page - 1) * size;

  return `${query} LIMIT ${size} OFFSET ${offset}`;
}
