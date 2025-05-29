export default class Card {
  id: string;
  title: string;
  sortTitle: string;
  text: string;
  type: string;
  subtype: string;
  rarity: string;
  set: string;
  setNumber: number;
  cost: number;
  power: number;
  hp: number;
  faction: string;
  colors: string[];
  imageUrl: string;
  unique: boolean;
  flavor: string;
  artist: string;
  alternateImageUrls?: string[];
  fullArtImageUrl?: string;
  keywords: string[];

  constructor(data: Partial<Card> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.sortTitle = data.sortTitle || this.title.replace(/^(The|A|An) /, '');
    this.text = data.text || '';
    this.type = data.type || '';
    this.subtype = data.subtype || '';
    this.rarity = data.rarity || '';
    this.set = data.set || '';
    this.setNumber = data.setNumber || 0;
    this.cost = data.cost || 0;
    this.power = data.power || 0;
    this.hp = data.hp || 0;
    this.faction = data.faction || '';
    this.colors = data.colors || [];
    this.imageUrl = data.imageUrl || '';
    this.unique = data.unique || false;
    this.flavor = data.flavor || '';
    this.artist = data.artist || '';
    this.alternateImageUrls = data.alternateImageUrls;
    this.fullArtImageUrl = data.fullArtImageUrl;
    this.keywords = data.keywords || [];
  }

  static fromJSON(json: any): Card {
    return new Card({
      id: json.id,
      title: json.title,
      sortTitle: json.sortTitle,
      text: json.text,
      type: json.type,
      subtype: json.subtype,
      rarity: json.rarity,
      set: json.set,
      setNumber: json.setNumber,
      cost: json.cost,
      power: json.power,
      hp: json.hp,
      faction: json.faction,
      colors: json.colors,
      imageUrl: json.imageUrl,
      unique: json.unique,
      flavor: json.flavor,
      artist: json.artist,
      alternateImageUrls: json.alternateImageUrls,
      fullArtImageUrl: json.fullArtImageUrl,
      keywords: json.keywords,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      sortTitle: this.sortTitle,
      text: this.text,
      type: this.type,
      subtype: this.subtype,
      rarity: this.rarity,
      set: this.set,
      setNumber: this.setNumber,
      cost: this.cost,
      power: this.power,
      hp: this.hp,
      faction: this.faction,
      colors: this.colors,
      imageUrl: this.imageUrl,
      unique: this.unique,
      flavor: this.flavor,
      artist: this.artist,
      alternateImageUrls: this.alternateImageUrls,
      fullArtImageUrl: this.fullArtImageUrl,
      keywords: this.keywords,
    };
  }
}