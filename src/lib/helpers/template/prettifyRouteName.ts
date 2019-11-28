import NamingUtils from '@/lib/helpers/NamingUtils';

export default (value: string) => {
  return NamingUtils.fixRouteName(value);
};
