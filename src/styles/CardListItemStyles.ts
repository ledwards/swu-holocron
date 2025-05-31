import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cardListItemContainer: {
    overflow: 'hidden',
    height: '100%',
  },
  cardListItem: {
    backgroundColor: '#000000',
    position: 'absolute',
  },
  cardListItemExpanded: {
    overflow: 'hidden',
    right: -60,
  },
  cardListItemCollapsed: {
    right: 0,
  },
  cardListItemImage: {
    borderRadius: 20,
    height: '100%',
  },
  cardListItemImageExpanded: {
    position: 'relative',
    left: -30,
    top: 0,
  },
  cardListItemImageCollapsed: {
    left: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderRadius: 3,
    marginBottom: 1,
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginBottom: 7,
  },
  cardMeta: {
    fontSize: 10,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    opacity: 0.9,
    marginBottom: 4,
  },
  cardInfo: {
    flex: 1,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  cardContent: {
    paddingLeft: 12,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  touchableContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  outerContainer: {
    marginVertical: 0,
    overflow: 'hidden',
  },
});

export default styles;