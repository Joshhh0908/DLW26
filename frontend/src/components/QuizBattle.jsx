import React, { useState, useEffect } from 'react';
import { Shield, Swords, User, Skull, ChevronRight, Send } from 'lucide-react';

// --- MOCK QUIZ DATA ---
// Woven with topics you are actively studying!
const mockQuestions = [
  {
    id: 1,
    type: 'single', // Multiple choice (single answer)
    question: "What is the primary purpose of a Semaphore in an operating system?",
    options: [
      "To allocate memory to new processes",
      "To control access to a shared resource in a concurrent system",
      "To prevent the CPU from overheating",
      "To compile code faster"
    ],
    correctAnswer: "To control access to a shared resource in a concurrent system",
    damage: 35
  },
  {
    id: 2,
    type: 'multiple', // Multiple choice (multiple answers)
    question: "Which of the following are true about Race Conditions? (Select all that apply)",
    options: [
      "They occur when multiple threads access shared data simultaneously",
      "They can be prevented using Mutex locks",
      "They only happen in single-core processors",
      "The outcome depends on the unpredictable timing of execution"
    ],
    correctAnswer: [
      "They occur when multiple threads access shared data simultaneously",
      "They can be prevented using Mutex locks",
      "The outcome depends on the unpredictable timing of execution"
    ],
    damage: 40
  },
  {
    id: 3,
    type: 'open', // Open-ended
    question: "Briefly explain how Direct Memory Access (DMA) improves overall system performance.",
    // For open-ended in a real app, you'd send this to your backend AI to grade. 
    // Here we use a keyword checker for the demo.
    correctKeywords: ["cpu", "memory", "without", "bypassing", "interrupt"], 
    damage: 50
  }
];

const QuizBattle = ({ onExit }) => {
  // Game State
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // Interaction State
  const [selectedSingle, setSelectedSingle] = useState(null);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [openAnswer, setOpenAnswer] = useState("");
  
  // Animation & Feedback State
  const [feedback, setFeedback] = useState(null);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQ = mockQuestions[currentQIndex];

  // --- COMBAT LOGIC ---
  const handleSubmit = () => {
    let isCorrect = false;

    // Check Answer based on type
    if (currentQ.type === 'single') {
      isCorrect = selectedSingle === currentQ.correctAnswer;
    } else if (currentQ.type === 'multiple') {
      const isExactMatch = 
        currentQ.correctAnswer.every(ans => selectedMultiple.includes(ans)) &&
        selectedMultiple.length === currentQ.correctAnswer.length;
      isCorrect = isExactMatch;
    } else if (currentQ.type === 'open') {
      const lowerAnswer = openAnswer.toLowerCase();
      // Simple logic: if they hit at least 2 keywords, count it as a win
      const hits = currentQ.correctKeywords.filter(kw => lowerAnswer.includes(kw));
      isCorrect = hits.length >= 2;
    }

    // Execute Attack Animations & Damage
    if (isCorrect) {
      setFeedback("It's super effective!");
      setIsPlayerAttacking(true);
      setTimeout(() => {
        setEnemyHP(prev => Math.max(0, prev - currentQ.damage));
        setIsPlayerAttacking(false);
      }, 500);
    } else {
      setFeedback("Not very effective... The concept strikes back!");
      setIsEnemyAttacking(true);
      setTimeout(() => {
        setPlayerHP(prev => Math.max(0, prev - 30)); // Fixed penalty damage
        setIsEnemyAttacking(false);
      }, 500);
    }

    // Progress the game after a short delay
    setTimeout(() => {
      setFeedback(null);
      setSelectedSingle(null);
      setSelectedMultiple([]);
      setOpenAnswer("");

      if (enemyHP - currentQ.damage <= 0 || playerHP - 30 <= 0 || currentQIndex + 1 >= mockQuestions.length) {
        setIsGameOver(true);
      } else {
        setCurrentQIndex(prev => prev + 1);
      }
    }, 2500);
  };

  // Helper to calculate HP Bar colors
  const getHpColor = (hp) => {
    if (hp > 50) return 'bg-green-500';
    if (hp > 20) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  // --- RENDERERS ---
  if (isGameOver) {
    const isWin = enemyHP === 0 || playerHP > enemyHP;
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#0B1120] text-white p-8">
        <h2 className={`text-6xl font-black mb-6 ${isWin ? 'text-yellow-400' : 'text-red-500'}`}>
          {isWin ? 'VICTORY!' : 'DEFEAT...'}
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          {isWin ? 'You have mastered this concept.' : 'You need to study this concept a bit more.'}
        </p>
        <button onClick={onExit} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xl transition-colors">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#1A202C] font-mono text-white relative overflow-hidden border-4 border-gray-700 rounded-2xl shadow-2xl">
      
      {/* --- THE ARENA (Top Half) --- */}
      <div className="flex-1 relative bg-gradient-to-b from-[#2D3748] to-[#1A202C] p-8 border-b-4 border-gray-700">
        
        {/* Enemy Status (Top Left) */}
        <div className="absolute top-8 left-8 bg-[#E2E8F0] p-4 border-4 border-gray-600 rounded-xl w-72 shadow-lg z-10">
          <h3 className="text-gray-900 font-black uppercase text-sm mb-2">Opponent Concept</h3>
          <div className="w-full bg-gray-800 h-4 rounded-full border-2 border-gray-900 p-[2px]">
            <div className={`h-full ${getHpColor(enemyHP)} transition-all duration-500`} style={{ width: `${enemyHP}%` }}></div>
          </div>
          <p className="text-right text-gray-800 font-bold mt-1 text-xs">HP: {enemyHP}/100</p>
        </div>

        {/* Enemy Sprite (Top Right) */}
        <div className={`absolute top-16 right-16 flex flex-col items-center transition-transform duration-100 ${isPlayerAttacking ? 'opacity-50 translate-x-4 animate-bounce' : ''}`}>
           <div className="w-40 h-40 bg-red-900/50 border-4 border-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <Skull className="w-20 h-20 text-red-400 drop-shadow-lg" />
           </div>
           {/* Temporary shadow */}
           <div className="w-24 h-4 bg-black/40 rounded-full mt-4 blur-sm"></div>
        </div>

        {/* Player Status (Bottom Right) */}
        <div className="absolute bottom-8 right-8 bg-[#E2E8F0] p-4 border-4 border-gray-600 rounded-xl w-72 shadow-lg z-10">
          <h3 className="text-gray-900 font-black uppercase text-sm mb-2">Companion (You)</h3>
          <div className="w-full bg-gray-800 h-4 rounded-full border-2 border-gray-900 p-[2px]">
            <div className={`h-full ${getHpColor(playerHP)} transition-all duration-500`} style={{ width: `${playerHP}%` }}></div>
          </div>
          <p className="text-right text-gray-800 font-bold mt-1 text-xs">HP: {playerHP}/100</p>
        </div>

        {/* Player Sprite (Bottom Left) */}
        <div className={`absolute bottom-8 left-16 flex flex-col items-center transition-transform duration-100 ${isEnemyAttacking ? 'opacity-50 -translate-x-4 animate-bounce' : ''} ${isPlayerAttacking ? 'translate-x-12 -translate-y-12' : ''}`}>
           <div className="w-40 h-40 bg-blue-900/50 border-4 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <User className="w-20 h-20 text-blue-400 drop-shadow-lg" />
           </div>
           <div className="w-24 h-4 bg-black/40 rounded-full mt-4 blur-sm"></div>
        </div>
      </div>

      {/* --- ACTION MENU (Bottom Half) --- */}
      <div className="h-2/5 bg-[#2D3748] p-6 flex flex-col">
        
        {/* Dialog Box / Question Text */}
        <div className="bg-blue-900/50 border-4 border-blue-400 p-4 rounded-xl mb-4 min-h-[5rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          {feedback ? (
            <p className="text-xl font-bold animate-pulse">{feedback}</p>
          ) : (
            <p className="text-lg leading-relaxed">{currentQ.question}</p>
          )}
        </div>

        {/* Inputs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!feedback && currentQ.type === 'single' && (
            <div className="grid grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedSingle(opt)}
                  className={`text-left p-4 border-2 rounded-xl transition-colors flex items-center gap-3
                    ${selectedSingle === opt ? 'bg-blue-600 border-blue-400' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
                  `}
                >
                  <ChevronRight className={`w-5 h-5 ${selectedSingle === opt ? 'text-white' : 'text-transparent'}`} />
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {!feedback && currentQ.type === 'multiple' && (
            <div className="grid grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedMultiple.includes(opt);
                return (
                  <button 
                    key={i}
                    onClick={() => {
                      if (isSelected) setSelectedMultiple(prev => prev.filter(item => item !== opt));
                      else setSelectedMultiple(prev => [...prev, opt]);
                    }}
                    className={`text-left p-4 border-2 rounded-xl transition-colors flex items-center gap-3
                      ${isSelected ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
                    `}
                  >
                    <div className={`w-4 h-4 border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-gray-400'}`}>
                      {isSelected && <div className="w-2 h-2 bg-purple-600"></div>}
                    </div>
                    <span className="text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {!feedback && currentQ.type === 'open' && (
            <textarea 
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              placeholder="Type your explanation here..."
              className="w-full h-full bg-gray-800 border-2 border-gray-600 rounded-xl p-4 text-white resize-none outline-none focus:border-blue-400 font-sans"
            />
          )}
        </div>

        {/* Submit Button */}
        {!feedback && (
          <div className="mt-4 flex justify-end">
             <button 
                onClick={handleSubmit}
                // Disable button if no answer is provided
                disabled={
                  (currentQ.type === 'single' && !selectedSingle) || 
                  (currentQ.type === 'multiple' && selectedMultiple.length === 0) || 
                  (currentQ.type === 'open' && openAnswer.trim().length === 0)
                }
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-8 border-b-4 border-red-800 active:border-b-0 active:mt-[4px] rounded-xl transition-all"
              >
                <Swords className="w-5 h-5" />
                ATTACK
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizBattle;