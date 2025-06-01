import * as FileSystem from 'expo-file-system';
import Card from '../models/Card';

const DATA_DIR = `${FileSystem.documentDirectory}data/`;
const CARDS_FILE = `${DATA_DIR}cards.json`;

export default async function loadCardDefinitions(): Promise<Card[]> {
  try {
    // Check if cards file exists
    const fileInfo = await FileSystem.getInfoAsync(CARDS_FILE);
    if (!fileInfo.exists) {
      return [];
    }

    // Read the file
    const fileContent = await FileSystem.readAsStringAsync(CARDS_FILE);
    const cardData = JSON.parse(fileContent);

    // Convert to Card instances
    const cards = cardData.map((cardJson: any) => Card.fromJSON(cardJson));

    return cards;
  } catch (error) {
    return [];
  }
}

export async function cardDefinitionsExist(): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(CARDS_FILE);
    return fileInfo.exists;
  } catch (error) {
    return false;
  }
}