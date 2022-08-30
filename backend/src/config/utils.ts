import { forEach } from 'lodash';

const MAKE_ID_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function makeid(length: number) {
  let result = '';
  const charactersLength = MAKE_ID_CHARS.length;
  for (let i = 0; i < length; i++) {
    result += MAKE_ID_CHARS.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const buildQuery = (data: Object): string => {
  const queries = [];
  forEach(data, (value, key) => {
    if (value) {
      queries.push(`${key}=${value}`);
    }
  });
  return queries.join('&');
};
