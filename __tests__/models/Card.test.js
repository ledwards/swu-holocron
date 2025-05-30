import Card from '../../src/models/Card';

describe('Card Model', () => {
  const mockCardData = {
    id: 'SOR_001',
    title: 'Luke Skywalker',
    subtitle: 'Faithful Friend',
    type: 'Unit',
    aspects: ['Heroism'],
    traits: ['Force', 'Rebel'],
    arenas: ['Ground'],
    cost: 6,
    power: 6,
    hp: 8,
    text: 'When Played: You may attack with a unit. It deals +2 damage for this attack.',
    set: 'SOR',
    number: '001',
    rarity: 'Legendary',
    artist: 'Ameen Naksewee',
    unique: true,
    doubleImage: false,
    frontArt: 'https://example.com/luke.jpg',
  };

  describe('constructor', () => {
    test('creates card with all properties', () => {
      const card = new Card(mockCardData);
      
      expect(card.id).toBe('SOR_001');
      expect(card.title).toBe('Luke Skywalker');
      expect(card.subtitle).toBe('Faithful Friend');
      expect(card.type).toBe('Unit');
      expect(card.aspects).toEqual(['Heroism']);
      expect(card.traits).toEqual(['Force', 'Rebel']);
      expect(card.arenas).toEqual(['Ground']);
      expect(card.cost).toBe(6);
      expect(card.power).toBe(6);
      expect(card.hp).toBe(8);
      expect(card.unique).toBe(true);
    });

    test('creates card with default values', () => {
      const card = new Card();
      
      expect(card.id).toBe('');
      expect(card.title).toBe('');
      expect(card.type).toBe('');
      expect(card.aspects).toEqual([]);
      expect(card.traits).toEqual([]);
      expect(card.arenas).toEqual([]);
      expect(card.cost).toBe(0);
      expect(card.text).toBe('');
      expect(card.unique).toBe(false);
    });
  });

  describe('fromJSON', () => {
    test('creates card from JSON data', () => {
      const card = Card.fromJSON(mockCardData);
      
      expect(card).toBeInstanceOf(Card);
      expect(card.title).toBe('Luke Skywalker');
      expect(card.subtitle).toBe('Faithful Friend');
      expect(card.aspects).toEqual(['Heroism']);
    });

    test('handles missing optional properties', () => {
      const minimalData = {
        id: 'SOR_002',
        title: 'Basic Card',
        type: 'Event',
        cost: 2,
      };
      
      const card = Card.fromJSON(minimalData);
      
      expect(card.id).toBe('SOR_002');
      expect(card.title).toBe('Basic Card');
      expect(card.subtitle).toBeUndefined();
      expect(card.aspects).toEqual([]);
      expect(card.power).toBeUndefined();
    });
  });

  describe('displayTitle', () => {
    test('returns title with subtitle when subtitle exists', () => {
      const card = new Card(mockCardData);
      expect(card.displayTitle).toBe('Luke Skywalker, Faithful Friend');
    });

    test('returns only title when no subtitle', () => {
      const cardData = { ...mockCardData, subtitle: undefined };
      const card = new Card(cardData);
      expect(card.displayTitle).toBe('Luke Skywalker');
    });
  });

  describe('type checking methods', () => {
    test('isUnit returns true for unit cards', () => {
      const card = new Card({ ...mockCardData, type: 'Unit' });
      expect(card.isUnit).toBe(true);
      expect(card.isEvent).toBe(false);
      expect(card.isUpgrade).toBe(false);
    });

    test('isEvent returns true for event cards', () => {
      const card = new Card({ ...mockCardData, type: 'Event' });
      expect(card.isEvent).toBe(true);
      expect(card.isUnit).toBe(false);
    });

    test('isUpgrade returns true for upgrade cards', () => {
      const card = new Card({ ...mockCardData, type: 'Upgrade' });
      expect(card.isUpgrade).toBe(true);
      expect(card.isUnit).toBe(false);
    });

    test('isBase returns true for base cards', () => {
      const card = new Card({ ...mockCardData, type: 'Base' });
      expect(card.isBase).toBe(true);
      expect(card.isUnit).toBe(false);
    });

    test('isLeader returns true for leader cards', () => {
      const card = new Card({ ...mockCardData, type: 'Leader' });
      expect(card.isLeader).toBe(true);
      expect(card.isUnit).toBe(false);
    });
  });

  describe('hasAspect', () => {
    test('returns true when card has the aspect', () => {
      const card = new Card(mockCardData);
      expect(card.hasAspect('Heroism')).toBe(true);
      expect(card.hasAspect('heroism')).toBe(true); // case insensitive
    });

    test('returns false when card does not have the aspect', () => {
      const card = new Card(mockCardData);
      expect(card.hasAspect('Villainy')).toBe(false);
    });
  });

  describe('hasTrait', () => {
    test('returns true when card has the trait', () => {
      const card = new Card(mockCardData);
      expect(card.hasTrait('Force')).toBe(true);
      expect(card.hasTrait('Rebel')).toBe(true);
      expect(card.hasTrait('force')).toBe(true); // case insensitive
    });

    test('returns true for partial trait matches', () => {
      const card = new Card(mockCardData);
      expect(card.hasTrait('Reb')).toBe(true); // partial match
    });

    test('returns false when card does not have the trait', () => {
      const card = new Card(mockCardData);
      expect(card.hasTrait('Imperial')).toBe(false);
    });
  });

  describe('hasArena', () => {
    test('returns true when card has the arena', () => {
      const card = new Card(mockCardData);
      expect(card.hasArena('Ground')).toBe(true);
      expect(card.hasArena('ground')).toBe(true); // case insensitive
    });

    test('returns false when card does not have the arena', () => {
      const card = new Card(mockCardData);
      expect(card.hasArena('Space')).toBe(false);
    });
  });

  describe('sortTitle', () => {
    test('removes leading articles from title', () => {
      const card1 = new Card({ title: 'The Death Star' });
      const card2 = new Card({ title: 'A New Hope' });
      const card3 = new Card({ title: 'An Imperial Shuttle' });
      const card4 = new Card({ title: 'Luke Skywalker' });
      
      expect(card1.sortTitle).toBe('Death Star');
      expect(card2.sortTitle).toBe('New Hope');
      expect(card3.sortTitle).toBe('Imperial Shuttle');
      expect(card4.sortTitle).toBe('Luke Skywalker');
    });
  });
});