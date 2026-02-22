export const processFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      let animeList = [];
      
      const fileType = file.name.split('.').pop().toLowerCase();
      
      if (fileType === 'txt') {
        animeList = content.split('\n').filter(line => line.trim() !== '');
      } else if (fileType === 'html' || fileType === 'xml') {
        // Create a temporary DOM parser to extract anime titles
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const animeElements = doc.querySelectorAll('anime');
        animeList = Array.from(animeElements).map(el => el.textContent.trim());
      } else {
        reject(new Error('Unsupported file type'));
        return;
      }
      
      resolve(animeList);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};