import React, { useState } from 'react';
import BackgroundAnimation from './components/BackgroundAnimation';
import FileUpload from './components/FileUpload';
import AnimeList from './components/AnimeList';
import Stats from './components/Stats';
import { processFile } from './utils/fileParser';
import { filterAnimeList } from './utils/animeFilter';
import './App.css';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcess = async (file) => {
    setIsProcessing(true);
    try {
      const content = await processFile(file);
      const filtered = filterAnimeList(content);
      setAnimeList(content);
      setFilteredList(filtered);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="app">
      <BackgroundAnimation />
      <div className="app-content">
        <header className="app-header">
          <h1>Anime Filter App</h1>
          <p>Upload your anime list to filter out movies, OVAs, and other extras</p>
        </header>
        
        <FileUpload onFileProcess={handleFileProcess} isProcessing={isProcessing} />
        
        {filteredList.length > 0 && (
          <>
            <Stats originalCount={animeList.length} filteredCount={filteredList.length} />
            <AnimeList items={filteredList} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;