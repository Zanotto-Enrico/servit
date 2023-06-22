
export interface Drink {
    _id: string,
    name: string,
    description: string,
    price: number,
    sizes: string[]
}
// type guard
export function isDrink(arg: any): arg is Drink {
    return arg && arg._id && typeof(arg._id) === 'string' 
               && arg.name && typeof(arg.name) === 'string' 
               && arg.description && typeof(arg.description) === 'string' 
               && arg.sizes && Array.isArray(arg.sizes)
               && arg.price && arg.price instanceof Number;
}

