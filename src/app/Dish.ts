
export interface Dish {
    _id: string,
    name: string,
    price: number,
    preparationTime: number,
    description: string,
    category: string
}
// type guard
export function isDish(arg: any): arg is Dish {
    return arg && arg._id && typeof(arg._id) === 'string' 
               && arg.name && typeof(arg.name) === 'string' 
               && arg.description && typeof(arg.description) === 'string' 
               && arg.category && typeof(arg.category) === 'string' 
               && arg.price && arg.price instanceof Number
               && arg.preparationTime && arg.preparationTime instanceof Number;
}

