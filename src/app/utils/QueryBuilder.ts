import {
  IqueryConfig,
  IqueryParams,
  PrismaWhereConditions,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaStringFilters,
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

          // relation.field
          if (parts.length === 2) {
            const [relation, nestedField] = parts;

            return {
              [relation]: {
                [nestedField]: stringFilter,
              },
            };
          }

          // relation.nestedRelation.field
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

          // direct field
          return {
            [field]: stringFilter,
          };
        },
      );

      const whereConditions = this.query.where as PrismaWhereConditions;
      whereConditions.OR = searchConditions;

      const countWhereConditions = this.countQuery
        .where as PrismaWhereConditions;
      countWhereConditions.OR = searchConditions;
    }

    return this;
  }

  // filter
  filter(): this {
    const { filterableFields } = this.config;

    const queryObj = { ...this.queryParams };

    // remove special query params
    const excludeFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "includes",
    ];

    const filterParams: Record<string, unknown>[] = [];

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludeFields.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where as Record<string, unknown>;
    const countWhere = this.countQuery.where as Record<string, unknown>;

    return this;
  }
}
