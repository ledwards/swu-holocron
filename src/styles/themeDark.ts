import colors from './colors';

const foregroundColor = colors.white;
const backgroundColor = colors.black;
const secondaryForegroundColor = colors.light;
const secondaryBackgroundColor = colors.dark;

const themeDark = {
  name: 'dark',
  foregroundColor: foregroundColor,
  backgroundColor: backgroundColor,
  secondaryForegroundColor: secondaryForegroundColor,
  secondaryBackgroundColor: secondaryBackgroundColor,
  disabledColor: colors.gray,
  iconColor: foregroundColor,

  translucentBackgroundColor: colors.alphaBlack,
  dividerColor: colors.dark,
  chipYesTextColor: backgroundColor,
  chipNoTextColor: backgroundColor,
  chipYesBorderColor: colors.darkGreen,
  chipNoBorderColor: colors.darkRed,
  chipYesBackgroundColor: colors.darkGreen,
  chipNoBackgroundColor: colors.red,

  statusBarStyle: 'light-content',
};

export default themeDark;