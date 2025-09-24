// Modern Interview Platform Component with Confidence Tracking
// Enhanced UI for React Interview Preparation

function ModernInterviewPlatform() {
    const [currentTier, setCurrentTier] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [confidenceRatings, setConfidenceRatings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('confidenceRatings')) || {};
        } catch {
            return {};
        }
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Tier configurations with enhanced data
    const tiers = [
        {
            id: 'top10',
            title: 'Top 10 Essential',
            subtitle: 'Must-Know Questions',
            description: 'Critical questions that appear in 90% of React interviews',
            gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
            icon: '🔥',
            frequency: '90%+',
            questions: 10,
            difficulty: 'Beginner to Intermediate',
            estimatedTime: '2-3 hours'
        },
        {
            id: 'top20', 
            title: 'Top 20 Core',
            subtitle: 'Fundamental Concepts',
            description: 'Core React concepts every developer should master',
            gradient: 'linear-gradient(135deg, #feca57, #ff9ff3)',
            icon: '⭐',
            frequency: '70%+',
            questions: 20,
            difficulty: 'Beginner to Advanced',
            estimatedTime: '4-6 hours'
        },
        {
            id: 'top50',
            title: 'Top 50 Advanced', 
            subtitle: 'Deep Dive Topics',
            description: 'Advanced patterns and best practices for senior roles',
            gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)',
            icon: '📈',
            frequency: '50%+',
            questions: 50,
            difficulty: 'Intermediate to Expert',
            estimatedTime: '10-15 hours'
        },
        {
            id: 'top100',
            title: 'Top 100 Complete',
            subtitle: 'Master Everything',
            description: 'Comprehensive coverage including edge cases and architecture',
            gradient: 'linear-gradient(135deg, #1dd1a1, #10ac84)',
            icon: '🏆',
            frequency: '25%+',
            questions: 100,
            difficulty: 'All levels',
            estimatedTime: '25-40 hours'
        }
    ];

    // Confidence tracking functions
    const updateConfidence = (questionId, level) => {
        const newRatings = {
            ...confidenceRatings,
            [questionId]: {
                level,
                timestamp: new Date().toISOString(),
                reviewCount: (confidenceRatings[questionId]?.reviewCount || 0) + 1
            }
        };
        setConfidenceRatings(newRatings);
        localStorage.setItem('confidenceRatings', JSON.stringify(newRatings));
        
        showNotification(`Confidence updated to level ${level}!`);
    };

    const getConfidenceColor = (level) => {
        const colors = {
            0: '#e2e8f0',
            1: '#feb2b2', 
            2: '#f6e05e',
            3: '#68d391',
            4: '#63b3ed',
            5: '#9f7aea'
        };
        return colors[level] || colors[0];
    };

    const getConfidenceLabel = (level) => {
        const labels = {
            0: 'Not familiar',
            1: 'Just heard of it',
            2: 'Basic understanding', 
            3: 'Can explain it',
            4: 'Very confident',
            5: 'Expert level'
        };
        return labels[level] || labels[0];
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Calculate overall progress
    const calculateProgress = (tierId) => {
        const tier = tiers.find(t => t.id === tierId);
        if (!tier) return { completed: 0, total: tier?.questions || 0, percentage: 0 };
        
        const questionsWithRatings = Object.keys(confidenceRatings)
            .filter(id => id.startsWith(tierId.slice(0, -1))) // Match tier prefix
            .length;
        
        return {
            completed: questionsWithRatings,
            total: tier.questions,
            percentage: Math.round((questionsWithRatings / tier.questions) * 100)
        };
    };

    return (
        <div className="modern-interview-platform" data-theme={theme}>
            <ModernHeader 
                theme={theme} 
                onToggleTheme={toggleTheme}
                currentTier={currentTier}
                onBack={() => setCurrentTier(null)}
            />
            
            {!currentTier ? (
                <TierSelection 
                    tiers={tiers}
                    onSelectTier={setCurrentTier}
                    confidenceRatings={confidenceRatings}
                    calculateProgress={calculateProgress}
                />
            ) : (
                <QuestionViewer
                    tier={currentTier}
                    onBack={() => setCurrentTier(null)}
                    confidenceRatings={confidenceRatings}
                    onUpdateConfidence={updateConfidence}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterDifficulty={filterDifficulty}
                    onFilterDifficultyChange={setFilterDifficulty}
                    filterCategory={filterCategory}
                    onFilterCategoryChange={setFilterCategory}
                />
            )}
            
            <NotificationContainer />
        </div>
    );
}

// Modern Header Component
function ModernHeader({ theme, onToggleTheme, currentTier, onBack }) {
    return (
        <header className="modern-header">
            <div className="header-container">
                <div className="logo-section">
                    {currentTier && (
                        <button className="back-btn" onClick={onBack}>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                    <div className="logo">
                        <i className="fab fa-react"></i>
                    </div>
                    <div className="brand-text">
                        <h1>React Interview Mastery</h1>
                        <p>Confidence-Based Learning System</p>
                    </div>
                </div>
                
                <div className="header-actions">
                    <button className="search-btn" title="Global Search">
                        <i className="fas fa-search"></i>
                    </button>
                    <button className="analytics-btn" title="Progress Analytics">
                        <i className="fas fa-chart-bar"></i>
                    </button>
                    <button className="theme-toggle" onClick={onToggleTheme} title="Toggle Theme">
                        <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
                    </button>
                </div>
            </div>
        </header>
    );
}

// Enhanced Tier Selection Component
function TierSelection({ tiers, onSelectTier, confidenceRatings, calculateProgress }) {
    return (
        <div className="tier-selection">
            <div className="hero-section">
                <h1 className="hero-title">
                    Choose Your <span className="gradient-text">Learning Path</span>
                </h1>
                <p className="hero-subtitle">
                    Master React interviews with our confidence-based learning system.
                    Track your progress and focus on areas that need improvement.
                </p>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-number">400+</div>
                    <div className="stat-label">Total Questions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">85%</div>
                    <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">12</div>
                    <div className="stat-label">Categories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">5</div>
                    <div className="stat-label">Confidence Levels</div>
                </div>
            </div>

            <div className="tiers-grid">
                {tiers.map((tier, index) => {
                    const progress = calculateProgress(tier.id);
                    
                    return (
                        <div 
                            key={tier.id} 
                            className="tier-card"
                            onClick={() => onSelectTier(tier.id)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="tier-header" style={{ background: tier.gradient }}>
                                <div className="tier-icon">{tier.icon}</div>
                                <div className="tier-number">{tier.questions}</div>
                                <h3 className="tier-title">{tier.title}</h3>
                                <p className="tier-subtitle">{tier.subtitle}</p>
                            </div>
                            
                            <div className="tier-body">
                                <p className="tier-description">{tier.description}</p>
                                
                                <div className="tier-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Frequency</span>
                                        <span className="metric-value">{tier.frequency}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Difficulty</span>
                                        <span className="metric-value">{tier.difficulty}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Est. Time</span>
                                        <span className="metric-value">{tier.estimatedTime}</span>
                                    </div>
                                </div>
                                
                                <div className="progress-section">
                                    <div className="progress-header">
                                        <span>Progress</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{ 
                                                width: `${progress.percentage}%`,
                                                background: tier.gradient
                                            }}
                                        ></div>
                                    </div>
                                    <div className="progress-details">
                                        <span>{progress.completed} of {progress.total} questions reviewed</span>
                                    </div>
                                </div>
                                
                                <button className="tier-btn">
                                    <i className="fas fa-play"></i>
                                    Start Learning
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Confidence Tracker Component
function ConfidenceTracker({ questionId, currentLevel = 0, onChange, compact = false }) {
    const [hoveredLevel, setHoveredLevel] = useState(0);
    
    const handleClick = (level) => {
        onChange(questionId, level);
    };

    const getConfidenceEmoji = (level) => {
        const emojis = ['😕', '🤔', '😐', '😊', '😎', '🔥'];
        return emojis[level] || emojis[0];
    };

    const getConfidenceColor = (level) => {
        const colors = {
            0: '#e2e8f0',
            1: '#feb2b2', 
            2: '#f6e05e',
            3: '#68d391',
            4: '#63b3ed',
            5: '#9f7aea'
        };
        return colors[level] || colors[0];
    };

    const getConfidenceLabel = (level) => {
        const labels = {
            0: 'Not familiar',
            1: 'Just heard of it',
            2: 'Basic understanding', 
            3: 'Can explain it',
            4: 'Very confident',
            5: 'Expert level'
        };
        return labels[level] || labels[0];
    };

    return (
        <div className={`confidence-tracker ${compact ? 'compact' : ''}`}>
            <div className="confidence-label">
                <span>Your confidence:</span>
                <span className="confidence-emoji">{getConfidenceEmoji(currentLevel)}</span>
            </div>
            
            <div className="confidence-circles">
                {[1, 2, 3, 4, 5].map(level => (
                    <div
                        key={level}
                        className={`confidence-circle ${currentLevel >= level ? 'filled' : ''} ${hoveredLevel >= level ? 'hovered' : ''}`}
                        onClick={() => handleClick(level)}
                        onMouseEnter={() => setHoveredLevel(level)}
                        onMouseLeave={() => setHoveredLevel(0)}
                        style={{
                            backgroundColor: currentLevel >= level ? getConfidenceColor(level) : '#e2e8f0',
                            borderColor: hoveredLevel >= level ? getConfidenceColor(level) : '#e2e8f0'
                        }}
                        title={`Level ${level}: ${getConfidenceLabel(level)}`}
                    >
                        <span className="circle-number">{level}</span>
                    </div>
                ))}
            </div>
            
            {!compact && (
                <div className="confidence-description">
                    <span>{getConfidenceLabel(hoveredLevel || currentLevel)}</span>
                    <span className="confidence-percentage">
                        {((hoveredLevel || currentLevel) * 20)}%
                    </span>
                </div>
            )}
        </div>
    );
}

// Notification System
function NotificationContainer() {
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        window.showNotification = (message, type = 'success') => {
            const id = Date.now();
            const notification = { id, message, type };
            
            setNotifications(prev => [...prev, notification]);
            
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 3000);
        };
    }, []);
    
    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div 
                    key={notification.id} 
                    className={`notification notification-${notification.type}`}
                >
                    <span>{notification.message}</span>
                    <button 
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}