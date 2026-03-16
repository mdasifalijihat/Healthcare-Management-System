import {
  IqueryConfig,
  IqueryParams,
  PrismaWhereConditions,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaStringFilters,
  PrismaNumberFilter,
  IQueryResult,
} from "../interface/query.interface";

export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs = {};
  private countQuery: PrismaCountArgs = {};

  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;

  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";

  private selectFields: Record<string, boolean | undefined> = {};

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IqueryParams,
    private config: IqueryConfig,
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {},
    };

    this.countQuery = {
      where: {},
    };
  }

  // ================= SEARCH =================
  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;

    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (field) => {
          const parts = field.split(".");

          const stringFilter: PrismaStringFilters = {
            contains: searchTerm,
            mode: "insensitive",
          };

          if (parts.length === 2) {
            const [relation, nestedField] = parts;

            return {
              [relation]: {
                [nestedField]: stringFilter,
              },
            };
          }

          if (parts.length === 3) {
            const [relation, nestedRelation, nestedField] = parts;

            return {
              [relation]: {
                [nestedRelation]: {
                  [nestedField]: stringFilter,
                },
              },
            };
          }

          return {
            [field]: stringFilter,
          };
        },
      );

      (this.query.where as PrismaWhereConditions).OR = searchConditions;
      (this.countQuery.where as PrismaWhereConditions).OR = searchConditions;
    }

    return this;
  }

  // ================= FILTER =================
  filter(): this {
    const { filterableFields } = this.config;

    const excludeFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "includes",
    ];

    const filterParams: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludeFields.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });

    const queryWhere = this.query.where as Record<string, unknown>;
    const countQueryWhere = this.countQuery.where as Record<string, unknown>;

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value === undefined || value === "") return;

      const isAllowedField =
        !filterableFields ||
        filterableFields.length === 0 ||
        filterableFields.includes(key);

      if (!isAllowedField) return;

      if (key.includes(".")) {
        const parts = key.split(".");

        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }

        if (parts.length === 2) {
          const [relation, nestedField] = parts;

          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }

          queryWhere[relation] = {
            [nestedField]: this.parseFilterValue(value),
          };

          countQueryWhere[relation] = {
            [nestedField]: this.parseFilterValue(value),
          };
          return;
        }

        if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }

          queryWhere[relation] = {
            [nestedRelation]: {
              [nestedField]: this.parseFilterValue(value),
            },
          };

          countQueryWhere[relation] = {
            [nestedRelation]: {
              [nestedField]: this.parseFilterValue(value),
            },
          };
          return;
        }
      } else {
        queryWhere[key] = this.parseFilterValue(value);
        countQueryWhere[key] = this.parseFilterValue(value);
        return;
      }
    });

    return this;
  }

  // ================= SORT =================
  sort(): this {
    const { sortBy, sortOrder } = this.queryParams;

    if (sortBy) {
      this.sortBy = sortBy;
    }

    if (sortOrder === "asc" || sortOrder === "desc") {
      this.sortOrder = sortOrder;
    }

    this.query.orderBy = {
      [this.sortBy]: this.sortOrder,
    };

    return this;
  }

  // ================= PAGINATION =================
  paginate(): this {
    this.page = Number(this.queryParams.page) || 1;
    this.limit = Number(this.queryParams.limit) || 10;

    this.skip = (this.page - 1) * this.limit;

    this.query.skip = this.skip;
    this.query.take = this.limit;

    return this;
  }

  //========= include ===========//
  include(relation: TInclude): this {
    if (this.selectFields) {
      return this;
    }

    this.query.include = {
      ...(this.query.include as Record<string, unknown>),
      ...(relation as unknown as Record<string, unknown>),
    } as Record<string, unknown>;

    return this;
  }

  //========= dynamic include ===========//
  dynamicInclude(
    includeConfig: Record<string, unknown>,
    defaultInclude?: string[],
  ): this {
    // prisma rule → select & include cannot together
    if (this.query.select) {
      return this;
    }

    const result: Record<string, unknown> = {};

    // default includes
    defaultInclude?.forEach((field) => {
      result[field] = true;
    });

    // dynamic includes from query ?include=profile,posts
    const includes = this.queryParams.includes;

    if (includes) {
      includes.split(",").forEach((field) => {
        const trimField = field.trim();

        if (includeConfig[trimField]) {
          result[trimField] = includeConfig[trimField];
        }
      });
    }

    this.query.include = {
      ...(this.query.include as Record<string, unknown>),
      ...result,
    };

    return this;
  }

  // ====where method ======//

  where(condition: TWhereInput): this {
    this.query.where = this.deepMerge(
      this.query.where as Record<string, unknown>,
      condition as Record<string, unknown>,
    );

    this.countQuery.where = this.deepMerge(
      this.countQuery.where as Record<string, unknown>,
      condition as Record<string, unknown>,
    );

    return this;
  }

  // ================= EXECUTE =================
  async execute(): Promise<IQueryResult<T>> {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery as Parameters<typeof this.model.count>[0],
      ),
      this.model.findMany(this.query as Parameters<typeof this.model.count>[0]),
    ]);

    const totalPages = Math.ceil(total / this.limit);

    return {
      data: data as T[],
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPage: totalPages,
      },
    };
  }

  // =============count=================//
  async count(): Promise<number> {
    return await this.model.count(
      this.countQuery as Parameters<typeof this.model.count>[0],
    );
  }

  getQuery(): PrismaFindManyArgs {
    return this.query;
  }

  // ================= HELPERS =================
  private parseFilterValue(value: unknown): unknown {
    if (value === "true") return true;
    if (value === "false") return false;

    if (typeof value === "string" && !isNaN(Number(value))) {
      return Number(value);
    }

    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }

    return value;
  }

  private parseRangeFilter(
    value: Record<string, unknown>,
  ): PrismaNumberFilter | PrismaStringFilters | Record<string, unknown> {
    const rangeQuery: Record<string, unknown> = {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] =
            typeof operatorValue === "string" && !isNaN(Number(operatorValue))
              ? Number(operatorValue)
              : operatorValue;
          break;

        case "in":
        case "notIn":
          rangeQuery[operator] = Array.isArray(operatorValue)
            ? operatorValue
            : [
                typeof operatorValue === "string" &&
                !isNaN(Number(operatorValue))
                  ? Number(operatorValue)
                  : operatorValue,
              ];
          break;

        default:
          break;
      }
    });

    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }

  // deepmerge

  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (
          result[key] &&
          typeof result[key] === "object" &&
          !Array.isArray(result[key])
        ) {
          result[key] = this.deepMerge(
            result[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>,
          );
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }
}
