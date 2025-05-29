import { Platform, StatusBar, Dimensions } from 'react-native';
import FilterQuerySet from '../models/FilterQuerySet';

const { height: screenHeight } = Dimensions.get('window');

const nativeHeaderTopHeight = (): number => {
  if (Platform.OS === 'android') {
    return 0;
  } else if (screenHeight >= 812) { // iPhone X and newer
    return 44;
  } else {
    return 0;
  }
};

const statusBarHeight = (): number =>
  Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight || 0);

const nativeFooterHeight = (): number => {
  if (Platform.OS === 'android') {
    return 0;
  } else if (screenHeight >= 812) { // iPhone X and newer
    return 24;
  } else {
    return 0;
  }
};

const searchBarHeight = (): number => 30;
const tabBarHeight = (): number => 44;

const filterQuerySetHeight = (filterQuerySet: FilterQuerySet): number =>
  45 + 25 * filterQuerySet.length() + (filterQuerySet.length() > 1 ? 35 : 0);

const nativeHeaderHeight = (): number => statusBarHeight() + nativeHeaderTopHeight();

const keyboardVerticalOffset = (): number =>
  -1 * (nativeFooterHeight() + tabBarHeight());

const footerHeight = (
  propTabBarHeight: number | undefined,
  filterQuerySet: FilterQuerySet | undefined,
): number =>
  nativeFooterHeight() +
  (propTabBarHeight || tabBarHeight()) +
  searchBarHeight() +
  (filterQuerySet ? filterQuerySetHeight(filterQuerySet) : 70);

const searchBottomPosition = (tabBarHeight: number): number =>
  nativeFooterHeight() + tabBarHeight + searchBarHeight();

const statusBarBottomPosition = (tabBarHeight: number): number =>
  nativeFooterHeight() +
  tabBarHeight +
  searchBarHeight() + // search bar needs this for some reason, half its height is in the position
  searchBarHeight();

export default {
  nativeHeaderTopHeight,
  nativeHeaderHeight,
  nativeFooterHeight,
  statusBarHeight,
  searchBarHeight,
  tabBarHeight,
  keyboardVerticalOffset,
  footerHeight,
  searchBottomPosition,
  statusBarBottomPosition,
};