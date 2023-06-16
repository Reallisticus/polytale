import { Scraper } from './lib/Scraper';
import * as fs from 'fs';

async function main() {
  // Create a new instance of the Scraper class
  const scraper = new Scraper('https://itgsolution.net');

  // Scrape the webpage
  const texts = await scraper.scrapeWebpage();

  // Do something with the scraped texts...
  fs.writeFileSync('output.json', JSON.stringify(texts, null, 2));
}

// Run the main function
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
