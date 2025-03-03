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
