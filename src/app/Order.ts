
export interface Order {
    _id: string,
    dishes: string[],
    drinks: string[],
    status: string,
    orderTime: Date,
    table: number
}
// type guard
export function isOrder(arg: any): arg is Order {
    return arg && arg._id && typeof(arg._id) === 'string' 
               && arg.dishes && Array.isArray(arg.dishes)
               && arg.drinks && Array.isArray(arg.drinks)
               && arg.orderTime && arg.orderTime instanceof Date 
               && arg.table && arg.table instanceof Number;
}

