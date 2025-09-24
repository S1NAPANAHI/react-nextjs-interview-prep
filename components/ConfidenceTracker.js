// Confidence Tracker Component for React Interview Questions
// 5-Circle Confidence Rating System

function ConfidenceTracker({ questionId, currentLevel = 0, onChange, compact = false }) {
    const [hoveredLevel, setHoveredLevel] = React.useState(0);
    
    const handleClick = (level) => {
        onChange(questionId, level);
        showNotification(`Confidence updated to level ${level}!`);
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

    const getConfidenceDescription = (level) => {
        const descriptions = {
            0: "Haven't encountered this topic",
            1: "Aware of the concept but limited understanding",
            2: "Can recognize and explain basics",
            3: "Solid understanding, can teach others",
            4: "Deep knowledge, can handle follow-ups",
            5: "Complete mastery, can discuss edge cases"
        };
        return descriptions[level] || descriptions[0];
    };

    return React.createElement('div', {
        className: `confidence-tracker ${compact ? 'compact' : ''}`
    }, [
        React.createElement('div', {
            key: 'label',
            className: 'confidence-label'
        }, [
            React.createElement('span', { key: 'text' }, 'Your confidence:'),
            React.createElement('span', {
                key: 'emoji',
                className: 'confidence-emoji'
            }, getConfidenceEmoji(currentLevel))
        ]),
        
        React.createElement('div', {
            key: 'circles',
            className: 'confidence-circles'
        }, [1, 2, 3, 4, 5].map(level =>
            React.createElement('div', {
                key: level,
                className: `confidence-circle ${
                    currentLevel >= level ? 'filled' : ''
                } ${hoveredLevel >= level ? 'hovered' : ''}`,
                onClick: () => handleClick(level),
                onMouseEnter: () => setHoveredLevel(level),
                onMouseLeave: () => setHoveredLevel(0),
                style: {
                    backgroundColor: currentLevel >= level ? getConfidenceColor(level) : '#e2e8f0',
                    borderColor: hoveredLevel >= level ? getConfidenceColor(level) : '#e2e8f0'
                },
                title: `Level ${level}: ${getConfidenceLabel(level)} - ${getConfidenceDescription(level)}`
            }, React.createElement('span', {
                className: 'circle-number'
            }, level.toString()))
        )),
        
        !compact && React.createElement('div', {
            key: 'description',
            className: 'confidence-description'
        }, [
            React.createElement('span', {
                key: 'label'
            }, getConfidenceLabel(hoveredLevel || currentLevel)),
            React.createElement('span', {
                key: 'percentage',
                className: 'confidence-percentage'
            }, `${((hoveredLevel || currentLevel) * 20)}%`)
        ])
    ]);
}

// Enhanced Question Card with Confidence Tracking
function EnhancedQuestionCard({ question, confidenceRating, onUpdateConfidence, isExpanded, onToggle }) {
    const difficultyColors = {
        'Beginner': '#10b981',
        'Intermediate': '#f59e0b', 
        'Advanced': '#ef4444',
        'Expert': '#8b5cf6'
    };

    const frequencyColor = question.frequency >= 90 ? '#ef4444' : 
                          question.frequency >= 70 ? '#f59e0b' : '#10b981';

    return React.createElement('div', {
        className: `question-card ${isExpanded ? 'expanded' : ''}`,
        'data-question-id': question.id
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'question-header',
            onClick: onToggle
        }, [
            React.createElement('div', {
                key: 'meta',
                className: 'question-meta'
            }, [
                React.createElement('span', {
                    key: 'frequency',
                    className: 'frequency-badge',
                    style: { backgroundColor: frequencyColor }
                }, `${question.frequency}%`),
                
                React.createElement('span', {
                    key: 'difficulty',
                    className: 'difficulty-badge',
                    style: { backgroundColor: difficultyColors[question.difficulty] }
                }, question.difficulty),
                
                React.createElement('span', {
                    key: 'category',
                    className: 'category-badge'
                }, question.category),
                
                React.createElement('span', {
                    key: 'priority',
                    className: 'priority-badge'
                }, `#${question.priority}`)
            ]),
            
            React.createElement('h3', {
                key: 'title',
                className: 'question-title'
            }, question.question),
            
            React.createElement('div', {
                key: 'actions',
                className: 'question-actions'
            }, [
                React.createElement('button', {
                    key: 'expand',
                    className: 'expand-btn',
                    'aria-label': isExpanded ? 'Collapse question' : 'Expand question'
                }, isExpanded ? '▼' : '▶')
            ])
        ]),

        isExpanded && React.createElement('div', {
            key: 'content',
            className: 'question-content'
        }, [
            React.createElement(ConfidenceTracker, {
                key: 'confidence',
                questionId: question.id,
                currentLevel: confidenceRating?.level || 0,
                onChange: onUpdateConfidence
            }),
            
            React.createElement('div', {
                key: 'answer',
                className: 'answer-section'
            }, [
                React.createElement('h4', { key: 'title' }, '📝 Detailed Answer'),
                React.createElement('div', {
                    key: 'text',
                    className: 'answer-text',
                    dangerouslySetInnerHTML: {
                        __html: question.answer
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>')
                    }
                })
            ]),

            question.codeExample && React.createElement('div', {
                key: 'code',
                className: 'code-section'
            }, [
                React.createElement('h4', { key: 'title' }, '💻 Code Example'),
                React.createElement('h5', { key: 'subtitle' }, question.codeExample.title),
                React.createElement('pre', {
                    key: 'code',
                    className: 'code-block'
                }, React.createElement('code', {}, question.codeExample.code)),
                React.createElement('button', {
                    key: 'copy',
                    className: 'copy-btn',
                    onClick: (e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(question.codeExample.code).then(() => {
                            e.target.textContent = '✅ Copied!';
                            setTimeout(() => {
                                e.target.textContent = '📋 Copy Code';
                            }, 2000);
                        });
                    }
                }, '📋 Copy Code')
            ]),

            question.keyPoints && React.createElement('div', {
                key: 'keypoints',
                className: 'key-points'
            }, [
                React.createElement('h4', { key: 'title' }, '🔑 Key Points'),
                React.createElement('ul', { key: 'list' }, 
                    question.keyPoints.map((point, index) =>
                        React.createElement('li', { key: index }, point)
                    )
                )
            ]),

            question.followUpQuestions && React.createElement('div', {
                key: 'followup',
                className: 'follow-up-questions'
            }, [
                React.createElement('h4', { key: 'title' }, '🎯 Follow-up Questions'),
                React.createElement('ul', { key: 'list' },
                    question.followUpQuestions.map((q, index) =>
                        React.createElement('li', { key: index }, q)
                    )
                )
            ])
        ])
    ]);
}

// Notification system for user feedback
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Make components globally available
window.ConfidenceTracker = ConfidenceTracker;
window.EnhancedQuestionCard = EnhancedQuestionCard;
window.showNotification = showNotification;