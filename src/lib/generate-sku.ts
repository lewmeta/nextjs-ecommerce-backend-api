export const generateSKU = (name: string) => {

    // Extract the first three letters of the product name, uppercase them.
    const extactString = name.substring(0, 4).toUpperCase();

    // Generate a random 5-digit number.
    const randomNumbers = Math.floor(1000 + Math.random() * 90000).toString()

    // Combine both to form the SKU.
    return `${extactString}-${randomNumbers}`

}

export const generateSubProductSKU = (name: string, colorHex: string, size?: string): string => {
    const existingName = name.substring(0, 4).toUpperCase();
    const existingSize = size?.toUpperCase();

    // Remove the # from the hex code and take the first 3 characters to shorten it
    const existingHexColor = colorHex.replace('#', '').substring(0, 3).toUpperCase();

    // Generate a random number for uniqueness

    const randomNumbers = Math.floor(1000 + Math.random() * 90000)

    return `${existingName}-${existingHexColor}-${randomNumbers}`

}