export const cleanString = (str: string) => {
  let cleanAux = str.trim()
  // if string ends with a dot but the previous character is not a space and not a dot, remove the dot
  if (
    cleanAux.endsWith(".") &&
    cleanAux[cleanAux.length - 2] !== " " &&
    cleanAux[cleanAux.length - 2] !== "."
  ) {
    cleanAux = cleanAux.slice(0, -1)
  }
  // if string ends with a comma but the previous character is not a space and not a comma, remove the comma
  if (
    cleanAux.endsWith(",") &&
    cleanAux[cleanAux.length - 2] !== " " &&
    cleanAux[cleanAux.length - 2] !== ","
  ) {
    cleanAux = cleanAux.slice(0, -1)
  }
  return cleanAux
}

export const formatAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4)
}

export const extractJSONfromString = (input: string) => {
  const inputCleaned = input.match(/```json\s*([\s\S]*?)\s*```/)
  if (!inputCleaned) return false

  return JSON.parse(inputCleaned[1])
}

export const formatNumber = (number: number) => {
  // si es 2000 pues que sea 2K, etc..
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(0) + "B"
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + "M"
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + "K"
  }

  return number
}
