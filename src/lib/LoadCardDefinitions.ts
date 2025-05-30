import * as FileSystem from 'expo-file-system';
import Card from '../models/Card';

const DATA_DIR = `${FileSystem.documentDirectory}data/`;
const CARDS_FILE = `${DATA_DIR}cards.json`;

export default async function loadCardDefinitions(): Promise<Card[]> {
  try {
    // Check if cards file exists
    const fileInfo = await FileSystem.getInfoAsync(CARDS_FILE);
    if (!fileInfo.exists) {
      console.log('Cards file does not exist');
      return [];
    }

    // Read the file
    const fileContent = await FileSystem.readAsStringAsync(CARDS_FILE);
    console.log(`File content length: ${fileContent.length} characters`);
    const cardData = JSON.parse(fileContent);
    console.log(`Parsed ${cardData.length} card objects from JSON`);

    // Convert to Card instances
    const cards = cardData.map((cardJson: any) => Card.fromJSON(cardJson));

    console.log(`Loaded ${cards.length} cards from file`);
    console.log(`Sample card:`, cards[0]);
    return cards;
  } catch (error) {
    console.error('Error loading card definitions:', error);
    return [];
  }
}

export async function cardDefinitionsExist(): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(CARDS_FILE);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking if card definitions exist:', error);
    return false;
  }
}