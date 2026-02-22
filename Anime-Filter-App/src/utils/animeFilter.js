const FILTER_KEYWORDS = ["OVA", "Movie", "Special", "ONA", "Recap", "Season", "Part"];

export const cleanTitle = (title) => {
  // Remove subtitles and extra words but keep full anime name
  let mainTitle = title.split(/[:\-|]/)[0].trim();
  mainTitle = mainTitle.replace(/https?.*/, '').trim();
  return mainTitle;
};

export const filterAnimeList = (animeList) => {
  // Remove duplicates & filter unwanted types
  const seenTitles = new Set();
  const filteredList = [];
  
  for (const anime of animeList) {
    if (FILTER_KEYWORDS.some(keyword => anime.includes(keyword))) {
      continue; // Skip OVAs, Movies, Specials, and other extras
    }
    
    const mainTitle = cleanTitle(anime);
    
    if (mainTitle && !seenTitles.has(mainTitle)) {
      seenTitles.add(mainTitle);
      filteredList.push(mainTitle);
    }
  }
  
  // Sort alphabetically and number the list
  return filteredList.sort().map((title, index) => `${index + 1}. ${title}`);
};