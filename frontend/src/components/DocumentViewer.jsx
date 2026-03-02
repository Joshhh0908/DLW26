import React from 'react';
import Highlighter from 'react-highlight-words';

const DocumentViewer = ({ text, searchWords, onWordClick }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg text-lg leading-relaxed">
      <Highlighter
        highlightClassName="bg-blue-200 text-blue-900 px-1 rounded cursor-pointer hover:bg-blue-300 transition"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={text}
        onClick={(e) => onWordClick(e.target.innerText)} 
      />
    </div>
  );
};

export default DocumentViewer;