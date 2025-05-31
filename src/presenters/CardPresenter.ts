import Card from '../models/Card';

class CardPresenter {
  private card: Card;

  constructor(card: Card) {
    this.card = card;
  }

  get sideways(): boolean {
    return false; // SWU cards are not sideways
  }

  get aspectRatio(): number {
    return 1.4; // Standard SWU card aspect ratio
  }

  get displayImageUrl(): string {
    return this.card.frontArt || '';
  }

  get displayBackImageUrl(): string {
    return this.card.backArt || '';
  }

  get displayTitle(): string {
    return this.card.title;
  }

  get displayExpansionSet(): string {
    return this.card.set;
  }

  get type(): string {
    return this.card.type;
  }

  get rarity(): string {
    return this.card.rarity;
  }

  get side(): 'Light' | 'Dark' {
    return 'Light'; // SWU doesn't have sides like SWCCG
  }

  get twoSided(): boolean {
    return this.card.type.toLowerCase() === 'leader'; // Only leaders have back art
  }

  get offsetY(): number {
    return 0; // No special offset needed for SWU
  }
}

export default CardPresenter;