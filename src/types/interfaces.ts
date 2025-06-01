export interface Theme {
  name: string;
  backgroundColor: string;
  foregroundColor: string;
  secondaryBackgroundColor?: string;
  secondaryForegroundColor?: string;
  dividerColor: string;
  translucentBackgroundColor: string;
  iconColor?: string;
  disabledColor?: string;
  chipYesTextColor?: string;
  chipNoTextColor?: string;
  chipYesBorderColor?: string;
  chipNoBorderColor?: string;
  chipYesBackgroundColor?: string;
  chipNoBackgroundColor?: string;
  statusBarStyle?: string;
}

export type ScrollToIndexFunction = (index: number) => void;

export type SearchCallback = (query: string) => void;

export interface SearchMode {
  index: number;
  label: string;
  icon: string;
  title: string;
  description: string;
}