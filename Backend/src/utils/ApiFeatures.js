class ApiFeatures {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    }

    search() {
        const keyword = this.querystr.keyword
            ? {
                  name: {
                      $regex: this.querystr.keyword,
                      $options: 'i', // case insensitive
                  },
              }
            : {};
        // console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter(){
        const queryCopy = {...this.querystr}
        // removig some  field for category
        const  removefield = ['keyword','page','limit']
         removefield.forEach(d=>delete queryCopy[d])


        //   filter for price and rating
        let querystr = JSON.stringify(queryCopy)
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$$(key)`)
         this.query = this.query.find(JSON.parse(querystr))  //  again change in object from
        //  console.log(queryCopy)
         return this
         
    }
    pagination(ResultPerPage){
     const currentPage = Number(this.querystr.page )|| 1
     const skip = ResultPerPage *(currentPage - 1)
     this.query = this.query.limit(ResultPerPage).skip(skip)
     return this
    }
}

 module.exports = ApiFeatures