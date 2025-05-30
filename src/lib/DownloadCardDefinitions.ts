import * as FileSystem from 'expo-file-system';
import Card from '../models/Card';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/erlloyd/star-wars-unlimited-json/main/sets';
const DATA_DIR = `${FileSystem.documentDirectory}data/`;
const CARDS_FILE = `${DATA_DIR}cards.json`;

const SET_FILES = [
  'Spark of Rebellion.json',
  'Shadows of the Galaxy.json',
  'Twilight of the Republic.json',
  'Jump to Lightspeed.json'
];

export default async function downloadCardDefinitions(): Promise<boolean> {
  try {
    // Ensure data directory exists
    const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
    }

    console.log('Downloading card definitions from GitHub...');
    
    let allCards: any[] = [];
    
    // Download each set file
    for (const setFile of SET_FILES) {
      console.log(`Downloading ${setFile}...`);
      const url = `${GITHUB_BASE_URL}/${encodeURIComponent(setFile)}`;
      console.log(`URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SWU-Holocron-App/1.0',
        },
      });

      if (!response.ok) {
        console.error(`Failed to download ${setFile}: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to download ${setFile}: ${response.status}`);
      }

      const setData = await response.json();
      console.log(`Downloaded ${setData.length} cards from ${setFile}`);
      console.log(`First card sample:`, setData[0]);
      
      // Transform each card to our Card format
      const transformedCards = setData.map((cardJson: any) => {
        return {
          id: `${cardJson.Set}_${cardJson.Number}`,
          title: cardJson.Name,
          subtitle: cardJson.Subtitle,
          type: cardJson.Type,
          aspects: cardJson.Aspects || [],
          traits: cardJson.Traits || [],
          arenas: cardJson.Arenas || [],
          cost: parseInt(cardJson.Cost) || 0,
          power: cardJson.Power ? parseInt(cardJson.Power) : undefined,
          hp: cardJson.HP ? parseInt(cardJson.HP) : undefined,
          text: cardJson.FrontText || cardJson.BackText || '',
          epicAction: cardJson.EpicAction,
          set: cardJson.Set,
          number: cardJson.Number,
          rarity: cardJson.Rarity,
          artist: cardJson.Artist,
          unique: cardJson.Unique || false,
          doubleImage: cardJson.DoubleSided || false,
          frontArt: cardJson.FrontArt,
          backArt: cardJson.BackArt,
          variants: [],
        };
      });
      
      allCards = allCards.concat(transformedCards);
    }

    // Save all cards to file
    await FileSystem.writeAsStringAsync(CARDS_FILE, JSON.stringify(allCards, null, 2));
    
    console.log(`Downloaded ${allCards.length} total cards successfully`);
    return true;
  } catch (error) {
    console.error('Error downloading card definitions:', error);
    return false;
  }
}