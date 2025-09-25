const { useState, useEffect } = React;

function FlashcardViewer() {
  const [flashcardsData, setFlashcardsData] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    setLoading(true);
    const data = await window.DataService.fetchFlashcards();
    if (data) {
      setFlashcardsData(data);
      const firstCategory = Object.keys(data.categories)[0];
      setCurrentCategory(firstCategory);
    }
    setLoading(false);
  };

  const handleCategoryChange = (categoryKey) => {
    setCurrentCategory(categoryKey);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (currentCategory && flashcardsData) {
      const cards = flashcardsData.categories[currentCategory].cards;
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
      setIsFlipped(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCategory && flashcardsData) {
      const cards = flashcardsData.categories[currentCategory].cards;
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setIsFlipped(false);
    }
  };

  if (loading) return <div className="loading">Loading flashcards...</div>;
  if (!flashcardsData) return <div className="error">Failed to load flashcards</div>;

  const categories = flashcardsData.categories;
  const currentCategoryData = categories[currentCategory];
  const currentCard = currentCategoryData?.cards[currentCardIndex];

  return (
    <div className="flashcard-viewer">
      {/* Category Selection */}
      <div className="category-selector">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`category-btn ${currentCategory === key ? 'active' : ''}`}
            onClick={() => handleCategoryChange(key)}
            style={{ borderColor: category.color }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-title">{category.title}</span>
            <span className="card-count">{category.cards.length} cards</span>
          </button>
        ))}
      </div>

      {/* Flashcard Display */}
      {currentCard && (
        <div className="flashcard-container">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-front">
              <h3>Question {currentCardIndex + 1}</h3>
              <p>{currentCard.front}</p>
              <div className="flip-hint">Click to reveal answer</div>
            </div>
            <div className="flashcard-back">
              <h3>Answer</h3>
              <div 
                className="answer-content"
                dangerouslySetInnerHTML={{ __html: currentCard.back.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flashcard-controls">
            <button onClick={handlePreviousCard} className="nav-btn">
              ← Previous
            </button>
            <span className="card-counter">
              {currentCardIndex + 1} of {currentCategoryData.cards.length}
            </span>
            <button onClick={handleNextCard} className="nav-btn">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

window.FlashcardViewer = FlashcardViewer;
