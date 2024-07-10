export class Category { 
        public     cat_id: number;
        public  Category_name: string ;
        public subcategories: Subcategories[]
    constructor( id: number, Category_name: string, subcategories:Subcategories[]){
        this.cat_id = id;
        this.Category_name = Category_name;
        this.subcategories = subcategories;

    }
}

export class Subcategories { 
 
    public  subcat_id: number ;
    public  SubCategory_name    : string ; 

    constructor(subcat_id: number, SubCategory_name: string) {
        this.subcat_id = subcat_id;
        this.SubCategory_name= SubCategory_name;
       
      }
} 