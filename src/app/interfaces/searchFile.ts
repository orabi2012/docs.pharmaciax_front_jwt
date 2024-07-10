export interface SearchFiltre{
    country_id: number|null ,
    category_id?: number|null,
    subcat_id?:number,
    file_name: string|null,
    year: number|null,
    doc_no: number|null,
    txt:string|null,
    status_id:number|null,
    isactive?:boolean,
    
}