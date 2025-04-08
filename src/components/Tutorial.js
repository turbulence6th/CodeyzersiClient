import React, { useState } from 'react';
import './Tutorial.css';

const Tutorial = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Reversi'ye Hoş Geldiniz!",
      content: "Bu kısa rehber size Reversi'nin temel stratejilerini ve başlangıç hamlelerini gösterecek.",
      image: "/images/tutorial/board-start.png" // Yerine varsayılan bir resim kullanılacak
    },
    {
      title: "Köşeler Çok Değerlidir",
      content: "Köşeler, bir kez ele geçirildiğinde asla çevrilemez. Köşeleri erken yakalamak büyük avantaj sağlar.",
      image: "/images/tutorial/corners.png"
    },
    {
      title: "C-Karelerinden Kaçının",
      content: "C-kareleri (köşelerin hemen yanındaki kareler) tehlikelidir. Rakibinize köşeyi verme riski oluşturur.",
      image: "/images/tutorial/c-squares.png"
    },
    {
      title: "Kenarlar Güçlüdür",
      content: "Kenar kareleri stratejik olarak değerlidir. Bir kenarı kontrol etmek, rakibinizin hamlelerini kısıtlar.",
      image: "/images/tutorial/edges.png"
    },
    {
      title: "Hareketliliğinizi Koruyun",
      content: "Çok fazla taş çevirmeye odaklanmayın. Hamle seçeneklerinizi korumak, rakibinizi kısıtlamak için önemlidir.",
      image: "/images/tutorial/mobility.png"
    },
    {
      title: "X-Karesi Stratejisi",
      content: "Köşeden iki kare uzaklıktaki çapraz kareler (X-kareleri) genellikle güvenli ve stratejik hamlelerdir.",
      image: "/images/tutorial/x-squares.png"
    },
    {
      title: "Açılış Hamleleri",
      content: "İyi bir başlangıç için merkezdeki karelere yakın oynayın, ancak C-karelerinden ve köşelere erişim veren hamlelerden kaçının.",
      image: "/images/tutorial/opening-moves.png"
    },
    {
      title: "Orta Oyun Stratejisi",
      content: "Orta oyunda, kenarları kontrol etmeye çalışın ve rakibinizin köşelere erişimini engelleyin. Taş sayınızdan çok, pozisyonunuzun kalitesine odaklanın.",
      image: "/images/tutorial/mid-game.png"
    },
    {
      title: "Oyun Sonu Stratejisi",
      content: "Oyun sonunda hamle seçeneklerinizi azaltmaya çalışın. Rakibinizi zor durumlara sokacak hamleler yapın ve taş sayınızı artırın.",
      image: "/images/tutorial/end-game.png"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-container">
        <button className="tutorial-close" onClick={onClose}>×</button>
        
        <div className="tutorial-step">
          <h2 className="tutorial-title">{tutorialSteps[currentStep].title}</h2>
          
          <div className="tutorial-content">
            <div className="tutorial-image-placeholder">
              {/* Resim yerine renk blokları kullanıyoruz */}
              <div className="tutorial-diagram">
                {currentStep === 0 && (
                  <div className="tutorial-board start-board">
                    <div className="board-center">
                      <div className="piece white"></div>
                      <div className="piece black"></div>
                      <div className="piece black"></div>
                      <div className="piece white"></div>
                    </div>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="tutorial-board">
                    <div className="corner-highlight tl"></div>
                    <div className="corner-highlight tr"></div>
                    <div className="corner-highlight bl"></div>
                    <div className="corner-highlight br"></div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="tutorial-board">
                    <div className="c-square-highlight"></div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="tutorial-board">
                    <div className="edge-highlight"></div>
                  </div>
                )}
                
                {currentStep === 4 && (
                  <div className="tutorial-board mobility">
                    <div className="mobility-arrow"></div>
                  </div>
                )}
                
                {currentStep === 5 && (
                  <div className="tutorial-board">
                    <div className="x-square-highlight"></div>
                  </div>
                )}
                
                {currentStep === 6 && (
                  <div className="tutorial-board">
                    <div className="opening-moves"></div>
                  </div>
                )}
                
                {currentStep === 7 && (
                  <div className="tutorial-board">
                    <div className="mid-game"></div>
                  </div>
                )}
                
                {currentStep === 8 && (
                  <div className="tutorial-board">
                    <div className="end-game"></div>
                  </div>
                )}
              </div>
            </div>
            
            <p className="tutorial-text">{tutorialSteps[currentStep].content}</p>
          </div>
          
          <div className="tutorial-nav">
            <button 
              className="tutorial-nav-button prev" 
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Önceki
            </button>
            
            <div className="tutorial-progress">
              {tutorialSteps.map((_, index) => (
                <span 
                  key={index} 
                  className={`progress-dot ${index === currentStep ? 'active' : ''}`}
                  onClick={() => setCurrentStep(index)}
                ></span>
              ))}
            </div>
            
            <button 
              className="tutorial-nav-button next" 
              onClick={handleNext}
            >
              {currentStep === tutorialSteps.length - 1 ? 'Bitir' : 'Sonraki'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial; 