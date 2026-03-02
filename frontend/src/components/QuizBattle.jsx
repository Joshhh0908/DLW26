import React, { useState, useEffect, useRef } from 'react';
import { Skull, User, ChevronRight } from 'lucide-react';
const correctResponses = [
  (answer) => `Correct. It is ${answer}.`,
  (answer) => `Impressive. The correct answer is ${answer}.`,
  (answer) => `That is right. ${answer}.`,
  (answer) => `You are just about there. ${answer}.`
];

const wrongResponses = [
  (answer) => `You are mistaken. Actually, it is ${answer}.`,
  (answer) => `Incorrect. The correct answer is ${answer}.`,
  (answer) => `Not quite. It is ${answer}.`,
  (answer) => `That is wrong. The answer is ${answer}.`
];
const getRandom = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];
const mockQuestions = [
  
  {
    id: 1,
    type: 'open',
    question: "Wild SEMAPHORE appeared! What is its primary purpose in an operating system?",
    correctAnswer: "control access to shared resources",
    damage: 35
  },
  {
    id: 2,
    type: 'open',
    question: "RACE CONDITION used MULTI-THREAD! What is a race condition?",
    correctAnswer: "when multiple threads access shared data and the outcome depends on timing",
    damage: 40
  },
  {
    id: 3,
    type: 'open',
    question: "Enemy DMA is charging! What does DMA stand for?",
    correctAnswer: "direct memory access",
    damage: 50
  }
];


const QuizBattle = ({ onExit }) => {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [selectedSingle, setSelectedSingle] = useState(null);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [openAnswer, setOpenAnswer] = useState("");
  
  const [feedback, setFeedback] = useState(null);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const currentQ = mockQuestions[currentQIndex];

  const handleSubmit = () => {
    let isCorrect = false;

    if (currentQ.type === 'single') {
      isCorrect = selectedSingle === currentQ.correctAnswer;
    } else if (currentQ.type === 'multiple') {
      const isExactMatch = 
        currentQ.correctAnswer.every(ans => selectedMultiple.includes(ans)) &&
        selectedMultiple.length === currentQ.correctAnswer.length;
      isCorrect = isExactMatch;
    } else if (currentQ.type === 'open') {

      const normalize = (str) =>
        str
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter(Boolean);

      const userTokens = normalize(openAnswer);
      const correctTokens = normalize(currentQ.correctAnswer);

      const intersection = userTokens.filter(token =>
        correctTokens.includes(token)
      );

      const similarity =
        intersection.length / Math.max(correctTokens.length, 1);

      // Threshold (tune between 0.5–0.7)
      isCorrect = similarity >= 0.6;
    }

    if (isCorrect) {
      const response = getRandom(correctResponses)(currentQ.correctAnswer);
      setFeedback("Companion used KNOWLEDGE! It's super effective! "+response);
      setIsPlayerAttacking(true);
      setTimeout(() => {
        setEnemyHP(prev => Math.max(0, prev - currentQ.damage));
        setIsPlayerAttacking(false);
      }, 500);
    } else {
      const response = getRandom(wrongResponses)(currentQ.correctAnswer);
      setFeedback("Companion missed! The Enemy Concept strikes back! "+response);
      setIsEnemyAttacking(true);
      setTimeout(() => {
        setPlayerHP(prev => Math.max(0, prev - 30));
        setIsEnemyAttacking(false);
      }, 500);
    }

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

  const getHpColor = (hp) => {
    if (hp > 50) return 'bg-[#48E870]'; 
    if (hp > 20) return 'bg-[#F8D030]'; 
    return 'bg-[#E84830]';              
  };

  if (isGameOver) {
    const isWin = enemyHP === 0 || playerHP > enemyHP;
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#060B14] text-white">
        <h2 className={`text-6xl font-black mb-6 ${isWin ? 'text-yellow-400' : 'text-red-500'}`}>
          {isWin ? 'CONCEPT DEFEATED!' : 'YOU BLACKED OUT...'}
        </h2>
        <button onClick={onExit} className="px-8 py-4 bg-white text-black font-bold rounded shadow-[4px_4px_0px_#3B82F6] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#3B82F6] transition-all font-mono">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#060B14] font-mono text-gray-800 relative overflow-hidden">
      
      <audio ref={audioRef} src="/battle-music.wav" autoPlay loop />

      {/* --- BATTLEFIELD (Top 65%) --- */}
      <div className="flex-1 relative bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-b-4 border-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Enemy Status */}
        <div className="absolute top-10 left-10 bg-[#F8F8F8] border-[3px] border-gray-800 rounded-bl-2xl rounded-tr-xl rounded-tl-md rounded-br-md w-[350px] p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] z-20">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wider">Opponent</h3>
            <span className="font-bold text-gray-900 text-sm">Lv50</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-full px-2 py-1">
            <span className="text-yellow-400 font-bold text-xs italic tracking-widest">HP</span>
            <div className="flex-1 bg-gray-600 h-3 rounded-full border border-gray-900">
              <div className={`h-full ${getHpColor(enemyHP)} transition-all duration-500 rounded-full`} style={{ width: `${enemyHP}%` }}></div>
            </div>
          </div>
        </div>

        {/* Enemy Sprite */}
        <div className={`absolute top-20 right-32 flex flex-col items-center transition-transform duration-100 ${isPlayerAttacking ? 'opacity-50 translate-x-4 animate-bounce' : ''}`}>
           <div className="w-48 h-48 bg-gray-900 border-4 border-red-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.5)] z-10">
              <Skull className="w-24 h-24 text-red-500" />
           </div>
           <div className="w-64 h-16 bg-gray-800 rounded-[100%] border-t-4 border-gray-600 -mt-10"></div>
        </div>


        {/* Player Sprite */}
        <div className={`absolute bottom-16 left-32 flex flex-col items-center transition-transform duration-100 ${isEnemyAttacking ? 'opacity-50 -translate-x-4 animate-bounce' : ''} ${isPlayerAttacking ? 'translate-x-12 -translate-y-12' : ''}`}>
           <div className="w-48 h-48 bg-gray-900 border-4 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10">
              <User className="w-24 h-24 text-blue-500" />
           </div>
           <div className="w-64 h-16 bg-gray-800 rounded-[100%] border-t-4 border-gray-600 -mt-10"></div>
        </div>

        {/* Player Status */}
        <div className="absolute bottom-10 right-10 bg-[#F8F8F8] border-[3px] border-gray-800 rounded-tl-2xl rounded-br-xl rounded-tr-md rounded-bl-md w-[350px] p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] z-20">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wider">Companion</h3>
            <span className="font-bold text-gray-900 text-sm">Lv99</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-full px-2 py-1 mb-1">
            <span className="text-yellow-400 font-bold text-xs italic tracking-widest">HP</span>
            <div className="flex-1 bg-gray-600 h-3 rounded-full border border-gray-900">
              <div className={`h-full ${getHpColor(playerHP)} transition-all duration-500 rounded-full`} style={{ width: `${playerHP}%` }}></div>
            </div>
          </div>
          <p className="text-right font-bold text-gray-900 text-sm">{playerHP} / 100</p>
        </div>
      </div>

      {/* --- ACTION MENU (Bottom 35%) --- */}
      <div className="h-[35%] bg-gray-800 p-4 flex gap-4">
        
        {/* Dialog Box */}
        <div className="flex-1 bg-white border-4 border-double border-gray-900 rounded-lg p-6 shadow-inner flex items-center">
          <p className="text-2xl text-gray-900 font-bold leading-relaxed">
            {feedback || currentQ.question}
          </p>
        </div>

        {/* Action Buttons */}
        {!feedback && (
          <div className="w-[500px] bg-white border-4 border-gray-900 rounded-lg p-4 grid grid-cols-2 gap-3 shadow-inner">
            
            {/* SINGLE CHOICE BUTTONS */}
            {currentQ.type === 'single' && currentQ.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => setSelectedSingle(opt)}
                // High contrast strict coloring
                className={`text-left p-3 rounded font-bold uppercase text-xs border-2 flex items-center relative group transition-colors shadow-sm
                  ${selectedSingle === opt 
                    ? 'bg-blue-600 border-blue-900 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-500'
                  }
                `}
              >
                {selectedSingle === opt && <ChevronRight className="w-5 h-5 absolute left-1 text-white" />}
                <span className={selectedSingle === opt ? "ml-6" : "ml-2 group-hover:ml-4 transition-all"}>{opt}</span>
              </button>
            ))}

            {/* MULTIPLE CHOICE BUTTONS */}
            {currentQ.type === 'multiple' && currentQ.options.map((opt, i) => {
              const isSelected = selectedMultiple.includes(opt);
              return (
                <button 
                  key={i}
                  onClick={() => {
                    if (isSelected) setSelectedMultiple(prev => prev.filter(item => item !== opt));
                    else setSelectedMultiple(prev => [...prev, opt]);
                  }}
                  className={`text-left p-3 rounded font-bold uppercase text-[10px] leading-tight flex items-start gap-2 border-2 transition-colors shadow-sm
                    ${isSelected 
                      ? 'bg-blue-600 border-blue-900 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-500'
                    }
                  `}
                >
                  <div className={`mt-0.5 w-3 h-3 border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-white bg-blue-600' : 'border-gray-500 bg-white'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white"></div>}
                  </div>
                  <span>{opt}</span>
                </button>
              );
            })}

            {/* OPEN ENDED INPUT */}
            {currentQ.type === 'open' && (
              <div className="col-span-2 flex flex-col h-full gap-2">
                <textarea 
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  placeholder="Type your attack..."
                  className="w-full flex-1 bg-gray-100 border-2 border-gray-400 p-3 rounded text-gray-900 resize-none outline-none focus:border-blue-500 font-sans text-sm shadow-inner"
                />
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="col-span-2 flex justify-end mt-1">
               <button 
                  onClick={handleSubmit}
                  disabled={
                    (currentQ.type === 'single' && !selectedSingle) || 
                    (currentQ.type === 'multiple' && selectedMultiple.length === 0) || 
                    (currentQ.type === 'open' && openAnswer.trim().length === 0)
                  }
                  className="bg-red-500 disabled:bg-gray-300 text-white disabled:text-gray-500 border-2 border-gray-900 font-black px-8 py-2 uppercase hover:bg-red-400 disabled:hover:bg-gray-300 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:shadow-none active:translate-y-[2px] active:shadow-none tracking-widest text-lg"
                >
                  FIGHT
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBattle;