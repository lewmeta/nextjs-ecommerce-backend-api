export const generateSKU = (name: string) => {

    // Extract the first three letters of the product name, uppercase them.
    const extactString = name.substring(0, 4).toUpperCase();

    // Generate a random 5-digit number.
    const randomNumbers = Math.floor(1000 + Math.random() * 90000).toString()

    // Combine both to form the SKU.
    return `${extactString}-${randomNumbers}`

}