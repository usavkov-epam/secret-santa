export const sanitizeForMarkdown = (value: string = '') => {
  return value.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
};
