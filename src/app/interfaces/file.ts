export interface File {
    message?:string,
    CreatedfileData?:{
        File_data_id?: string,
        file_name?: string,
        Doc_No?: string,
        Year?: string,
        file_Path?: string,
        isAuthorized?: boolean,
        isactive?: number,
        Country?: {
            id?: number,
            country_name?: string
        },
        Category?: {
            cat_id?: number,
            Category_name?: string
        },
        subCategories?: [
            {
                subcat_id?: number,
                SubCategory_name?: string
            }
        ]
    }
   
}
    
    
