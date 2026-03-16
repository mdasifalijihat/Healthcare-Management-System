export interface PrismaFindManyArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean | Record<string, unknown>>;
  orderBy?: Record<string, unknown | Record<string, unknown>[]>;
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: string[] | string;
  [key: string]: unknown;
}
export interface PrismaCountArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean | Record<string, unknown>>;
  orderBy?: Record<string, unknown | Record<string, unknown>[]>;
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: string[] | string;
  [key: string]: unknown;
}

export interface IqueryParams {
  searchTerm?: string;
  page: string;
  limit?: string;
  sortBy?: string;
  SortOrder?: "asc" | "desc";
  fields?: string;
  [key: string]: string | undefined;
}

export interface PrismaModelDelegate {
  findMany(args?: PrismaFindManyArgs): Promise<unknown[]>;
  count(args?: PrismaCountArgs): Promise<number>;
}

export interface IQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  includes?: string;
  [key: string]: unknown;
}

export interface IqueryConfig {
  searchableFields?: string[];
  filterableFields?: string[];
}

export interface PrismaStringFilters {
  contains: string;
  starsWith?: string;
  endsWith?: string;
  mode?: "insensitive" | "default";
  in?: string[];
  notIn?: string[];
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  not?: PrismaStringFilters | string;
}

export interface PrismaWhereConditions {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface PrismaNumberFilter {
  equals?: number;
  in?: number[];
  notIn?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  not?: PrismaNumberFilter | number;
}

export interface IQueryResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
