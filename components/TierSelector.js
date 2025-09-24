class TierSelector {
    constructor(container, onTierSelect) {
        this.container = container;
        this.onTierSelect = onTierSelect;
        this.selectedTier = null;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="tier-selector">
                <div class="tier-header">
                    <h2>Choose Your Challenge Level</h2>
                    <p>Select a tier that matches your current React knowledge</p>
                </div>
                <div class="tier-grid">
                    ${this.generateTierCards()}
                </div>
                <div class="tier-recommendation">
                    <h3>Not sure which tier to start with?</h3>
                    <button class="assessment-btn" onclick="this.startAssessment()">Take Quick Assessment</button>
                </div>
            </div>
        `;
        this.setupEventListeners();
    }

    generateTierCards() {
        const tiers = [
            {
                id: 'essential',
                title: 'Essential Top 10',
                icon: '🌱',
                level: 'Beginner',
                time: '30-45 min',
                description: 'Perfect for React newcomers and quick refreshers',
                color: '#4CAF50',
                features: ['Basic concepts', 'JSX fundamentals', 'Component basics']
            },
            {
                id: 'core',
                title: 'Core Top 20',
                icon: '🎯',
                level: 'Intermediate',
                time: '60-90 min',
                description: 'Comprehensive foundation for most React positions',
                color: '#2196F3',
                features: ['Hooks mastery', 'State management', 'Performance basics']
            },
            {
                id: 'advanced',
                title: 'Advanced Top 50',
                icon: '🚀',
                level: 'Advanced',
                time: '2-3 hours',
                description: 'Deep patterns and optimization techniques',
                color: '#FF9800',
                features: ['Advanced patterns', 'Optimization', 'Architecture']
            },
            {
                id: 'expert',
                title: 'Expert Top 100',
                icon: '🏆',
                level: 'Expert',
                time: '4-6 hours',
                description: 'Comprehensive mastery for senior positions',
                color: '#9C27B0',
                features: ['System design', 'Complex patterns', 'Leadership topics']
            }
        ];

        return tiers.map(tier => `
            <div class="tier-card" data-tier="${tier.id}" style="--tier-color: ${tier.color}">
                <div class="tier-card-header">
                    <div class="tier-icon">${tier.icon}</div>
                    <div class="tier-badge">${tier.level}</div>
                </div>
                <h3 class="tier-title">${tier.title}</h3>
                <p class="tier-description">${tier.description}</p>
                <div class="tier-meta">
                    <span class="tier-time">⏱️ ${tier.time}</span>
                </div>
                <div class="tier-features">
                    ${tier.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <button class="tier-select-btn" data-tier="${tier.id}">Start ${tier.title}</button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Button clicks
        this.container.querySelectorAll('.tier-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tierId = e.target.dataset.tier;
                this.selectTier(tierId);
            });
        });

        // Card clicks
        this.container.querySelectorAll('.tier-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('tier-select-btn')) {
                    const tierId = card.dataset.tier;
                    this.highlightTier(tierId);
                }
            });
        });
    }

    highlightTier(tierId) {
        this.container.querySelectorAll('.tier-card').forEach(card => {
            card.classList.remove('highlighted');
        });
        this.container.querySelector(`[data-tier="${tierId}"]`).classList.add('highlighted');
    }

    selectTier(tierId) {
        this.selectedTier = tierId;
        this.onTierSelect(tierId);
    }

    startAssessment() {
        // Launch assessment modal
        alert('Assessment feature coming soon! For now, try "Essential Top 10" if you\'re new to React, or "Core Top 20" if you have some experience.');
    }
}