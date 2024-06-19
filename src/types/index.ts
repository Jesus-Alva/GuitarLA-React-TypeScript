export type Guitar = {
    id: number
    name: String
    image: String
    description: String
    price: number
}

export type CartItem = Guitar & {
    quantity: number
}
