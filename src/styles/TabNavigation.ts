import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0,
    height: 44,
    borderTopColor: 'transparent',
    zIndex: 1001,
  },
  tabBarItemStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    zIndex: 1002,
  },
  activeTabBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  tabIcon: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 44,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabBarIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;