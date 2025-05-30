export default class Card {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  aspects: string[];
  traits: string[];
  arenas: string[];
  cost: number;
  power?: number;
  hp?: number;
  text: string;
  epicAction?: string;
  set: string;
  number: string;
  rarity: string;
  artist?: string;
  unique: boolean;
  doubleImage?: boolean;
  frontArt?: string;
  backArt?: string;
  variants?: CardVariant[];

  constructor(data: Partial<Card> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.subtitle = data.subtitle;
    this.type = data.type || '';
    this.aspects = data.aspects || [];
    this.traits = data.traits || [];
    this.arenas = data.arenas || [];
    this.cost = data.cost || 0;
    this.power = data.power;
    this.hp = data.hp;
    this.text = data.text || '';
    this.epicAction = data.epicAction;
    this.set = data.set || '';
    this.number = data.number || '';
    this.rarity = data.rarity || '';
    this.artist = data.artist;
    this.unique = data.unique || false;
    this.doubleImage = data.doubleImage || false;
    this.frontArt = data.frontArt;
    this.backArt = data.backArt;
    this.variants = data.variants || [];
  }

  static fromJSON(json: any): Card {
    return new Card({
      id: json.id,
      title: json.title,
      subtitle: json.subtitle,
      type: json.type,
      aspects: json.aspects || [],
      traits: json.traits || [],
      arenas: json.arenas || [],
      cost: json.cost,
      power: json.power,
      hp: json.hp,
      text: json.text,
      epicAction: json.epicAction,
      set: json.set,
      number: json.number,
      rarity: json.rarity,
      artist: json.artist,
      unique: json.unique,
      doubleImage: json.doubleImage,
      frontArt: json.frontArt,
      backArt: json.backArt,
      variants: json.variants,
    });
  }

  get displayTitle(): string {
    return this.subtitle ? `${this.title}, ${this.subtitle}` : this.title;
  }

  get isUnit(): boolean {
    return this.type.toLowerCase() === 'unit';
  }

  get isEvent(): boolean {
    return this.type.toLowerCase() === 'event';
  }

  get isUpgrade(): boolean {
    return this.type.toLowerCase() === 'upgrade';
  }

  get isBase(): boolean {
    return this.type.toLowerCase() === 'base';
  }

  get isLeader(): boolean {
    return this.type.toLowerCase() === 'leader';
  }

  hasAspect(aspect: string): boolean {
    return this.aspects.some(a => a.toLowerCase() === aspect.toLowerCase());
  }

  hasTrait(trait: string): boolean {
    return this.traits.some(t => t.toLowerCase().includes(trait.toLowerCase()));
  }

  hasArena(arena: string): boolean {
    return this.arenas.some(a => a.toLowerCase() === arena.toLowerCase());
  }

  get sortTitle(): string {
    return this.title.replace(/^(The|A|An) /, '');
  }
}

export interface CardVariant {
  id: string;
  art: string;
  rarity?: string;
}

export type CardType = 'Unit' | 'Event' | 'Upgrade' | 'Base' | 'Leader';
export type CardAspect = 'Command' | 'Aggression' | 'Cunning' | 'Vigilance' | 'Heroism' | 'Villainy';
export type CardArena = 'Ground' | 'Space';
export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Special';