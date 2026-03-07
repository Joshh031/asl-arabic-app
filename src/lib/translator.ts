const charMap: Record<string, string> = {
  'k': 'ك', 't': 'ت', 'b': 'ب', 'd': 'د', 'r': 'ر', 's': 'س', 'm': 'م', 'a': 'ا'
};

export const getArabicScript = (input: string) => {
  return input.toLowerCase().split('').map(char => charMap[char] || char).join('');
};