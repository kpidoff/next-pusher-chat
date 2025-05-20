export const generateColorFromId = (id: string): string => {
  const hash = id.split("").reduce((acc, char) => {
    const charCode = char.charCodeAt(0);
    return (acc << 5) - acc + charCode;
  }, 0);
  const goldenRatio = 0.618033988749895;
  const hue = (hash * goldenRatio) % 360;
  return `hsl(${hue}, 85%, 75%)`;
}; 