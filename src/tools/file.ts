export function formatFileSize(size: number, unit: 'o' | 'b' = 'o') {
  if (!size) {
    return '-';
  }
  const k = 1024;
  const sizes = ['', 'K', 'M', 'G'];
  const i = Math.floor(Math.log(size)/Math.log(k));
  const rounded = parseFloat((size/Math.pow(k,i)).toFixed(1));
  return `${rounded} ${sizes[i]}${unit}`
}
