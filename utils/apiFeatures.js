export class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Express req.query
    this.prismaOptions = {};
  }

  // 1. Filtering (e.g. ?type=PROJECT or ?building=Main)
  filter() {
    const queryObj = { ...this.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.prismaOptions.where = {
      ...(this.prismaOptions.where || {}),
      ...queryObj,
    };

    return this;
  }

  // 2. Field Selection / Projection (e.g. ?fields=id,name,code)
  select() {
    if (this.query.fields) {
      const fieldsArray = this.query.fields.split(",");
      const selectObj = {};

      fieldsArray.forEach((field) => {
        selectObj[field.trim()] = true;
      });

      this.prismaOptions.select = selectObj;
    }
    return this;
  }

  // 3. Sorting (e.g. ?sort=name or ?sort=-createdAt)
  sort() {
    if (this.query.sort) {
      const sortFields = this.query.sort.split(",");
      const orderBy = sortFields.map((field) => {
        if (field.startsWith("-")) {
          return { [field.slice(1)]: "desc" };
        }
        return { [field]: "asc" };
      });

      this.prismaOptions.orderBy = orderBy;
    }
    return this;
  }

  // 4. Pagination (e.g. ?page=2&limit=10)
  paginate() {
    const page = Math.max(1, parseInt(this.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(this.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    this.prismaOptions.skip = skip;
    this.prismaOptions.take = limit;

    this.paginationMeta = { page, limit, skip };
    return this;
  }
}
