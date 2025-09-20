import React from 'react';
import './AnimeList.css';

const AnimeList = ({ items }) => {
  const copyToClipboard = () => {
    const textToCopy = items.join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('List copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>Filtered Anime List ({items.length} unique series)</h2>
        <button onClick={copyToClipboard} className="copy-button">
          Copy to Clipboard
        </button>
      </div>
      
      <div className="anime-list">
        {items.map((item, index) => (
          <div key={index} className="anime-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeList;