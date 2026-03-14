// import { unknown } from "zod";
// import {
//   IqueryConfig,
//   IqueryParams,
//   PrismaWhereConditions,
//   PrismaCountArgs,
//   PrismaFindManyArgs,
//   PrismaModelDelegate,
//   PrismaStringFilters,
//   PrismaNumberFilter,
// } from "../interface/query.interface";

// export class QueryBuilder<
//   T,
//   TWhereInput = Record<string, unknown>,
//   TInclude = Record<string, unknown>,
// > {
//   private query: PrismaFindManyArgs = {};
//   private countQuery: PrismaCountArgs = {};

//   private page: number = 1;
//   private limit: number = 10;
//   private skip: number = 0;

//   private sortBy: string = "createdAt";
//   private sortOrder: "asc" | "desc" = "desc";

//   private selectFields: Record<string, boolean | undefined> = {};

//   constructor(
//     private model: PrismaModelDelegate,
//     private queryParams: IqueryParams,
//     private config: IqueryConfig,
//   ) {
//     this.query = {
//       where: {},
//       include: {},
//       orderBy: {},
//     };

//     this.countQuery = {
//       where: {},
//     };
//   }
//   search(): this {
//     const { searchTerm } = this.queryParams;
//     const { searchableFields } = this.config;

//     if (searchTerm && searchableFields && searchableFields.length > 0) {
//       const searchConditions: Record<string, unknown>[] = searchableFields.map(
//         (field) => {
//           const parts = field.split(".");

//           const stringFilter: PrismaStringFilters = {
//             contains: searchTerm,
//             mode: "insensitive",
//           };

//           // relation.field
//           if (parts.length === 2) {
//             const [relation, nestedField] = parts;

//             return {
//               [relation]: {
//                 [nestedField]: stringFilter,
//               },
//             };
//           }

//           // relation.nestedRelation.field
//           if (parts.length === 3) {
//             const [relation, nestedRelation, nestedField] = parts;

//             return {
//               [relation]: {
//                 [nestedRelation]: {
//                   [nestedField]: stringFilter,
//                 },
//               },
//             };
//           }

//           // direct field
//           return {
//             [field]: stringFilter,
//           };
//         },
//       );

//       const whereConditions = this.query.where as PrismaWhereConditions;
//       whereConditions.OR = searchConditions;

//       const countWhereConditions = this.countQuery
//         .where as PrismaWhereConditions;
//       countWhereConditions.OR = searchConditions;
//     }

//     return this;
//   }

//   filter(): this {
//     const { filterableFields } = this.config;

//     const excludeFields = [
//       "searchTerm",
//       "page",
//       "limit",
//       "sortBy",
//       "sortOrder",
//       "fields",
//       "includes",
//     ];

//     const filterParams: Record<string, unknown> = {};

//     Object.keys(this.queryParams).forEach((key) => {
//       if (!excludeFields.includes(key)) {
//         filterParams[key] = this.parseFilterValue(this.queryParams[key]);
//       }
//     });

//     const queryWhere = this.query.where as Record<string, unknown>;
//     const countQueryWhere = this.countQuery.where as Record<string, unknown>;

//     Object.entries(filterParams).forEach(([key, value]) => {
//       if (value === undefined || value === "") return;

//       const isAllowedField =
//         !filterableFields ||
//         filterableFields.length === 0 ||
//         filterableFields.includes(key);

//       if (!isAllowedField) return;

//       if (key.includes(".")) {
//         const parts = key.split(".");

//         if (parts.length === 2) {
//           const [relation, nestedField] = parts;

//           queryWhere[relation] = {
//             [nestedField]: value,
//           };

//           countQueryWhere[relation] = {
//             [nestedField]: value,
//           };
//         }

//         if (parts.length === 3) {
//           const [relation, nestedRelation, nestedField] = parts;

//           queryWhere[relation] = {
//             [nestedRelation]: {
//               [nestedField]: value,
//             },
//           };

//           countQueryWhere[relation] = {
//             [nestedRelation]: {
//               [nestedField]: value,
//             },
//           };
//         }
//       } else {
//         queryWhere[key] = value;
//         countQueryWhere[key] = value;
//       }
//       if(typeof value === 'object' && value !== null && !Array.isArray(value)){
//         queryWhere[key] = this.parseFilterValue(value);
//         countQueryWhere[key] =this.parseFilterValue(value)
//         return
//       }

//       // direct value pars
//       queryWhere[key] = this.parseFilterValue(value);
//       countQueryWhere[key] = this.parseFilterValue(value)

//     })

//     return this;
//   }

//   private parseFilterValue(value: unknown): unknown {
//     if (value === "true") return true;
//     if (value === "false") return false;

//     if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
//       return Number(value);
//     }
//     if (Array.isArray(value)) {
//       return { in: value.map((item) => this.parseFilterValue(item)) };
//     }

//     return value;
//   }

//   private parseRangeFilter(
//     value: Record<string, unknown>,
//   ): PrismaNumberFilter | PrismaStringFilters | Record<string, unknown> {
//     const rangeQuery: Record<string, string | number | (string | number)> = {
//       Object.keys(value).forEach((operator) => {
//         const opareatorValue =value[operator];

//         const parsedValue : string | number = typeof opareatorValue === "string" &&v !isNaN(Number(opareatorValue)) ? Number(opareatorValue): opareatorValue;

//         switch(operator){
//           case "lt":
//           case "lte":
//           case "gt":
//           case "gte":
//           case "equals":
//           case "not":
//           case "contains":
//           case "startsWith":
//           case "endsWith":
//           rangeQuery.operator = parsedValue;
//           break;

//           case 'in':
//           case 'notIn' :
//             if(Array.isArray(opareatorValue)){
//               rangeQuery[operator] = opareatorValue
//             }else {
//               rangeQuery[operator] =[parsedValue]
//             }

//         }
//         break;
//         default:
//         break
//       })
//       return Object.keys(rangeQuery).length > 0 ? rangeQuery :value;

//     };
//   }
// }

import {
  IqueryConfig,
  IqueryParams,
  PrismaWhereConditions,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaStringFilters,
  PrismaNumberFilter,
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

  // ================= EXECUTE =================
  async execute() {
    const data = await this.model.findMany(this.query);
    const total = await this.model.count(this.countQuery);

    return {
      meta: {
        page: this.page,
        limit: this.limit,
        total,
      },
      data,
    };
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
}
