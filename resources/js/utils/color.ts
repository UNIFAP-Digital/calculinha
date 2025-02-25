/**
 * Função para gerar esquemas de cores a partir de uma cor hexadecimal
 * @param hexColor - Cor hexadecimal no formato #RRGGBB
 * @param options - Opções de personalização (opcional)
 * @returns Um objeto contendo a cor principal, secundária e cor de texto
 */
function generateColorScheme(
  hexColor: string,
  options: {
    angle?: number // Ângulo no círculo cromático para a cor secundária (padrão: 30)
    saturationShift?: number // Alteração na saturação (-1 a 1, padrão: 0)
    lightnessShift?: number // Alteração na luminosidade (-1 a 1, padrão: 0)
  } = {},
): {
  primaryColor: string
  secondaryColor: string
  textColor: string
} {
  // Definir valores padrão para as opções
  const angle = options.angle ?? 30
  const saturationShift = options.saturationShift ?? 0.1
  const lightnessShift = options.lightnessShift ?? -0.15

  // Validar e normalizar a entrada hexadecimal
  const hex = hexColor.startsWith('#') ? hexColor : `#${hexColor}`

  // Converter para RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Calcular a cor secundária
  const [h, s, l] = rgbToHsl(r, g, b)

  // Aplicar as transformações
  const newHue = (h + angle) % 360
  const newSaturation = Math.max(0, Math.min(1, s + saturationShift))
  const newLightness = Math.max(0, Math.min(1, l + lightnessShift))

  // Converter de volta para RGB
  const [sr, sg, sb] = hslToRgb(newHue, newSaturation, newLightness)

  // Converter para hex
  const secondaryHex = `#${componentToHex(sr)}${componentToHex(sg)}${componentToHex(sb)}`

  // Determinar a cor do texto
  const textColor = getTextColor(r, g, b)

  return {
    primaryColor: hex,
    secondaryColor: secondaryHex,
    textColor: textColor,
  }
}

/**
 * Converte RGB para HSL
 * @returns [h, s, l] Array com valores HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h * 360, s, l]
}

/**
 * Converte HSL para RGB
 * @returns [r, g, b] Array com valores RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360

  let r, g, b

  if (s === 0) {
    r = g = b = l // acromático
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * Determina a cor de texto ideal (preto ou branco) com base na luminosidade da cor de fundo
 * Usa recomendações de acessibilidade do WCAG para contraste
 */
function getTextColor(r: number, g: number, b: number): string {
  // Fórmula de luminosidade relativa do WCAG
  const luminance = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2

  // Retorna preto para cores claras, branco para cores escuras
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

/**
 * Função auxiliar para converter um componente de cor em representação hexadecimal
 */
function componentToHex(c: number): string {
  const hex = Math.round(c).toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * Gera um gradiente a partir de duas cores
 * @param startColor - Cor inicial do gradiente (hex)
 * @param endColor - Cor final do gradiente (hex)
 * @param steps - Número de passos/cores intermediárias
 * @returns Array de cores em formato hexadecimal
 */
function generateGradient(startColor: string, endColor: string, steps: number = 5): string[] {
  // Normalizar cores
  const start = startColor.startsWith('#') ? startColor : `#${startColor}`
  const end = endColor.startsWith('#') ? endColor : `#${endColor}`

  // Converter para RGB
  const r1 = parseInt(start.slice(1, 3), 16)
  const g1 = parseInt(start.slice(3, 5), 16)
  const b1 = parseInt(start.slice(5, 7), 16)

  const r2 = parseInt(end.slice(1, 3), 16)
  const g2 = parseInt(end.slice(3, 5), 16)
  const b2 = parseInt(end.slice(5, 7), 16)

  // Calcular diferenças
  const rStep = (r2 - r1) / (steps - 1)
  const gStep = (g2 - g1) / (steps - 1)
  const bStep = (b2 - b1) / (steps - 1)

  // Gerar cores intermediárias
  const gradient: string[] = []

  for (let i = 0; i < steps; i++) {
    const r = Math.round(r1 + rStep * i)
    const g = Math.round(g1 + gStep * i)
    const b = Math.round(b1 + bStep * i)

    gradient.push(`#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`)
  }

  return gradient
}

/**
 * Verifica se uma cor é clara (true) ou escura (false)
 * @param hexColor - Cor hexadecimal
 * @returns boolean - true se for clara, false se for escura
 */
function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // Fórmula YIQ - dá mais peso ao verde pois o olho humano é mais sensível a ele
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150
}

/**
 * Clareia uma cor por uma porcentagem
 * @param hexColor - Cor hexadecimal
 * @param percent - Porcentagem para clarear (0 a 1)
 * @returns Cor clareada em formato hexadecimal
 */
function lightenColor(hexColor: string, percent: number): string {
  const hex = hexColor.replace('#', '')
  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)

  r = Math.min(255, Math.floor(r + (255 - r) * percent))
  g = Math.min(255, Math.floor(g + (255 - g) * percent))
  b = Math.min(255, Math.floor(b + (255 - b) * percent))

  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

/**
 * Escurece uma cor por uma porcentagem
 * @param hexColor - Cor hexadecimal
 * @param percent - Porcentagem para escurecer (0 a 1)
 * @returns Cor escurecida em formato hexadecimal
 */
function darkenColor(hexColor: string, percent: number): string {
  const hex = hexColor.replace('#', '')
  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)

  r = Math.max(0, Math.floor(r * (1 - percent)))
  g = Math.max(0, Math.floor(g * (1 - percent)))
  b = Math.max(0, Math.floor(b * (1 - percent)))

  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

export { darkenColor, generateColorScheme, generateGradient, isLightColor, lightenColor }
