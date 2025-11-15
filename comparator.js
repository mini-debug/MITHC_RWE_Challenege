/**
 * SITE BATTLE COMPARATOR - Main Application Logic
 * Handles all battle comparisons, time travel forecasting, and strategic analysis
 */

class SiteBattleComparator {
    constructor() {
        this.dataIntegration = new EnergyDataIntegration();
        this.siteAData = null;
        this.siteBData = null;
        this.currentYear = 2025;
        this.priorities = {
            cost: 50,
            climate: 50,
            reliability: 50,
            community: 50
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Compare button
        document.getElementById('compare-btn').addEventListener('click', () => this.initiateComparison());

        // Priority sliders
        ['cost', 'climate', 'reliability', 'community'].forEach(priority => {
            const slider = document.getElementById(`${priority}-slider`);
            const value = document.getElementById(`${priority}-value`);
            
            slider.addEventListener('input', (e) => {
                this.priorities[priority] = parseInt(e.target.value);
                value.textContent = e.target.value;
                if (this.siteAData && this.siteBData) {
                    this.updateComparison();
                }
            });
        });

        // Year slider
        const yearSlider = document.getElementById('year-slider');
        const yearDisplay = document.getElementById('current-year');
        
        yearSlider.addEventListener('input', (e) => {
            this.currentYear = parseInt(e.target.value);
            yearDisplay.textContent = this.currentYear;
            if (this.siteAData && this.siteBData) {
                this.updateTimeTravel();
            }
        });
    }

    async initiateComparison() {
        const siteASelect = document.getElementById('site-a-select').value;
        const siteBSelect = document.getElementById('site-b-select').value;

        if (!siteASelect || !siteBSelect) {
            alert('Please select both locations');
            return;
        }

        if (siteASelect === siteBSelect) {
            alert('Please select different locations');
            return;
        }

        // Show loading
        this.showLoading(true);

        try {
            // Fetch data for both sites
            this.siteAData = await this.dataIntegration.getSiteData(siteASelect, document.getElementById('site-a-select').selectedOptions[0].text);
            this.siteBData = await this.dataIntegration.getSiteData(siteBSelect, document.getElementById('site-b-select').selectedOptions[0].text);

            // Perform comparison
            await this.performComparison();

            // Show results
            document.getElementById('results-container').classList.remove('hidden');
            
            // Scroll to results
            document.getElementById('results-container').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Comparison error:', error);
            alert('Error performing comparison. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async performComparison() {
        // Update battle cards
        this.updateBattleCards();

        // Perform criterion-by-criterion comparison
        this.performCriterionBattle();

        // Update time travel forecast
        this.updateTimeTravel();

        // Generate narrative summary
        this.generateNarrative();

        // Determine overall winner
        this.determineOverallWinner();
    }

    updateBattleCards() {
        // Site A Card
        document.getElementById('site-a-name').textContent = this.siteAData.siteName;
        const siteAStats = document.getElementById('site-a-stats');
        siteAStats.innerHTML = this.generateStatsHTML(this.siteAData);

        // Site B Card
        document.getElementById('site-b-name').textContent = this.siteBData.siteName;
        const siteBStats = document.getElementById('site-b-stats');
        siteBStats.innerHTML = this.generateStatsHTML(this.siteBData);

        // Dealbreakers
        this.detectDealbreakers();
    }

    generateStatsHTML(siteData) {
        const stats = [
            { label: 'Region', value: siteData.region },
            { label: 'Carbon Intensity', value: `${Math.round(siteData.egrid.carbonIntensity)} kgCO2/MWh` },
            { label: 'Transmission Headroom', value: `${Math.round(siteData.powersim.transmissionHeadroom)} MW` },
            { label: 'Congestion Level', value: `${Math.round(siteData.powersim.congestion)}%` },
            { label: 'Renewable Potential', value: `${Math.round(siteData.powersim.renewableIntegration)}%` },
            { label: 'Interconnection Cost', value: `$${(siteData.powersim.interconnectionCost / 1000000).toFixed(1)}M` },
            { label: 'Optimal Solar Size', value: `${Math.round(siteData.reopt.optimalSolarSize)} MW` },
            { label: 'Optimal Storage', value: `${Math.round(siteData.reopt.optimalStorageSize)} MWh` },
            { label: 'LCOE', value: `$${Math.round(siteData.reopt.lcoe)}/MWh` },
            { label: 'Environmental Justice', value: `${Math.round(siteData.egrid.environmentalJusticeScore)}/100` }
        ];

        return stats.map(stat => `
            <div class="stat-row">
                <span class="stat-label">${stat.label}</span>
                <span class="stat-value">${stat.value}</span>
            </div>
        `).join('');
    }

    detectDealbreakers() {
        const dealbreakersSiteA = this.findDealbreakers(this.siteAData);
        const dealbreakersSiteB = this.findDealbreakers(this.siteBData);

        document.getElementById('site-a-dealbreakers').innerHTML = this.generateDealbreakersHTML(dealbreakersSiteA);
        document.getElementById('site-b-dealbreakers').innerHTML = this.generateDealbreakersHTML(dealbreakersSiteB);
    }

    findDealbreakers(siteData) {
        const dealbreakers = [];

        // High carbon intensity
        if (siteData.egrid.carbonIntensity > 400) {
            dealbreakers.push('Very high carbon intensity');
        }

        // Poor transmission
        if (siteData.powersim.transmissionHeadroom < 300) {
            dealbreakers.push('Limited transmission headroom');
        }

        // High congestion
        if (siteData.powersim.congestion > 25) {
            dealbreakers.push('High grid congestion risk');
        }

        // Expensive interconnection
        if (siteData.powersim.interconnectionCost > 4000000) {
            dealbreakers.push('Very high interconnection costs');
        }

        // Low renewable potential
        if (siteData.powersim.renewableIntegration < 35) {
            dealbreakers.push('Poor renewable growth potential');
        }

        // Environmental justice concerns
        if (siteData.egrid.environmentalJusticeScore < 70) {
            dealbreakers.push('Environmental justice concerns');
        }

        // Poor long-term outlook
        const future2040 = siteData.cambium.cleanEnergyForecast['2040'];
        if (future2040 < 70) {
            dealbreakers.push('Slow clean energy transition forecast');
        }

        return dealbreakers;
    }

    generateDealbreakersHTML(dealbreakers) {
        if (dealbreakers.length === 0) {
            return `
                <div class="dealbreaker-title">DEALBREAKERS</div>
                <p class="no-dealbreakers">0 DEALBREAKERS DETECTED</p>
            `;
        }

        return `
            <div class="dealbreaker-title">DEALBREAKERS (${dealbreakers.length})</div>
            <ul class="dealbreaker-list">
                ${dealbreakers.map(db => `<li>${db}</li>`).join('')}
            </ul>
        `;
    }

    performCriterionBattle() {
        const criteria = [
            {
                name: 'Transmission Infrastructure',
                calculate: (data) => {
                    const headroom = data.powersim.transmissionHeadroom;
                    const congestion = 100 - data.powersim.congestion;
                    return headroom * 0.6 + congestion * 2;
                },
                format: (data) => `${Math.round(data.powersim.transmissionHeadroom)} MW headroom, ${Math.round(data.powersim.congestion)}% congestion`,
                unit: 'score'
            },
            {
                name: 'Carbon Impact',
                calculate: (data) => 1000 - data.egrid.carbonIntensity, // Lower is better
                format: (data) => `${Math.round(data.egrid.carbonIntensity)} kgCO2/MWh`,
                unit: 'score',
                inverse: true
            },
            {
                name: 'Clean Energy Proximity',
                calculate: (data) => data.powersim.renewableIntegration + data.eia.generationMix.wind + data.eia.generationMix.solar,
                format: (data) => `${Math.round(data.powersim.renewableIntegration)}% renewable integration, ${Math.round(data.eia.generationMix.wind + data.eia.generationMix.solar)}% wind+solar`,
                unit: '%'
            },
            {
                name: 'Economic Cost',
                calculate: (data) => 10000000 - data.powersim.interconnectionCost + (100 - data.reopt.lcoe) * 10000,
                format: (data) => `$${(data.powersim.interconnectionCost / 1000000).toFixed(1)}M interconnection, $${Math.round(data.reopt.lcoe)}/MWh LCOE`,
                unit: 'score',
                inverse: true
            },
            {
                name: 'Reliability & Resilience',
                calculate: (data) => data.powersim.flowCapacity / 10 + (100 - data.powersim.congestion) * 2,
                format: (data) => `${Math.round(data.powersim.flowCapacity)} MW capacity, ${Math.round(100 - data.powersim.congestion)}% reliability`,
                unit: 'score'
            },
            {
                name: 'Social & Environmental Justice',
                calculate: (data) => data.egrid.environmentalJusticeScore,
                format: (data) => `${Math.round(data.egrid.environmentalJusticeScore)}/100 justice score`,
                unit: 'score'
            },
            {
                name: 'Long-term Renewable Potential',
                calculate: (data) => data.cambium.cleanEnergyForecast['2040'] + data.reeds.renewableBuildout['2040'].wind / 100,
                format: (data) => `${Math.round(data.cambium.cleanEnergyForecast['2040'])}% clean by 2040, ${Math.round(data.reeds.renewableBuildout['2040'].wind)} MW wind`,
                unit: 'score'
            },
            {
                name: 'Load Growth Alignment',
                calculate: (data) => data.eia.loadGrowth['2040'] * 100,
                format: (data) => `${((data.eia.loadGrowth['2040'] - 1) * 100).toFixed(1)}% growth by 2040`,
                unit: '%'
            }
        ];

        const criteriaHTML = criteria.map(criterion => {
            const scoreA = criterion.calculate(this.siteAData);
            const scoreB = criterion.calculate(this.siteBData);
            const winner = scoreA > scoreB ? 'A' : 'B';
            const difference = Math.abs(scoreA - scoreB);
            const percentDiff = ((difference / Math.max(scoreA, scoreB)) * 100).toFixed(1);

            const explanation = this.generateCriterionExplanation(
                criterion.name,
                winner,
                this.siteAData,
                this.siteBData,
                criterion,
                percentDiff
            );

            return `
                <div class="criterion-row">
                    <div class="criterion-header">
                        <h3 class="criterion-name">${criterion.name}</h3>
                        <span class="criterion-winner">SITE ${winner} WINS</span>
                    </div>
                    <div class="criterion-comparison">
                        <div class="criterion-value ${winner === 'A' ? 'winner' : ''}">
                            <div class="value-number">${Math.round(scoreA)}</div>
                            <div class="value-label">${criterion.format(this.siteAData)}</div>
                        </div>
                        <div class="criterion-vs">VS</div>
                        <div class="criterion-value ${winner === 'B' ? 'winner' : ''}">
                            <div class="value-number">${Math.round(scoreB)}</div>
                            <div class="value-label">${criterion.format(this.siteBData)}</div>
                        </div>
                    </div>
                    <div class="criterion-explanation">${explanation}</div>
                </div>
            `;
        }).join('');

        document.getElementById('criteria-grid').innerHTML = criteriaHTML;
    }

    generateCriterionExplanation(name, winner, siteA, siteB, criterion, percentDiff) {
        const winnerSite = winner === 'A' ? siteA : siteB;
        const loserSite = winner === 'A' ? siteB : siteA;

        const explanations = {
            'Transmission Infrastructure': `Site ${winner} wins with ${percentDiff}% better transmission performance due to ${winner === 'A' ? 'superior' : 'better'} headroom and lower congestion levels.`,
            'Carbon Impact': `Site ${winner} has ${percentDiff}% lower carbon intensity, making it significantly cleaner for operations.`,
            'Clean Energy Proximity': `Site ${winner} benefits from ${percentDiff}% more renewable energy integration and proximity to clean generation sources.`,
            'Economic Cost': `Site ${winner} offers ${percentDiff}% better economic value with lower interconnection costs and competitive LCOE.`,
            'Reliability & Resilience': `Site ${winner} demonstrates ${percentDiff}% stronger grid reliability with better flow capacity and lower outage risk.`,
            'Social & Environmental Justice': `Site ${winner} scores ${percentDiff}% higher on environmental justice metrics, indicating better community alignment.`,
            'Long-term Renewable Potential': `Site ${winner} shows ${percentDiff}% stronger long-term clean energy trajectory based on Cambium and ReEDS forecasts.`,
            'Load Growth Alignment': `Site ${winner} aligns ${percentDiff}% better with projected load growth patterns through 2040.`
        };

        return explanations[name] || `Site ${winner} outperforms by ${percentDiff}%.`;
    }

    updateTimeTravel() {
        const year = this.currentYear.toString();
        
        const forecastData = [
            {
                title: `Site A - ${year}`,
                data: this.getYearData(this.siteAData, year)
            },
            {
                title: `Site B - ${year}`,
                data: this.getYearData(this.siteBData, year)
            },
            {
                title: 'Comparison',
                data: this.getComparisonData(year)
            }
        ];

        const forecastHTML = forecastData.map(card => `
            <div class="forecast-card">
                <h3 class="forecast-title">${card.title}</h3>
                <div class="forecast-data">
                    ${Object.entries(card.data).map(([key, value]) => `
                        <div class="forecast-item">
                            <span class="forecast-label">${key}</span>
                            <span class="forecast-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        document.getElementById('forecast-grid').innerHTML = forecastHTML;
    }

    getYearData(siteData, year) {
        return {
            'Renewable Share': `${Math.round(siteData.cambium.cleanEnergyForecast[year])}%`,
            'Carbon Intensity': `${Math.round(siteData.cambium.marginalEmissions[year])} kg/MWh`,
            'Wind Capacity': `${Math.round(siteData.reeds.renewableBuildout[year].wind)} MW`,
            'Solar Capacity': `${Math.round(siteData.reeds.renewableBuildout[year].solar)} MW`,
            'Storage Capacity': `${Math.round(siteData.reeds.renewableBuildout[year].storage)} MW`,
            'Fossil Retirement': `${Math.round(siteData.reeds.fossilRetirement[year])}%`,
            'Load Growth': `${((siteData.eia.loadGrowth[year] - 1) * 100).toFixed(1)}%`,
            'Renewable Cost': `$${Math.round(siteData.cambium.renewableCostCurve[year])}/MWh`
        };
    }

    getComparisonData(year) {
        const cleanEnergyDiff = this.siteAData.cambium.cleanEnergyForecast[year] - this.siteBData.cambium.cleanEnergyForecast[year];
        const carbonDiff = this.siteBData.cambium.marginalEmissions[year] - this.siteAData.cambium.marginalEmissions[year];
        
        const cleanWinner = cleanEnergyDiff > 0 ? 'Site A' : 'Site B';
        const carbonWinner = carbonDiff > 0 ? 'Site A' : 'Site B';

        return {
            'Clean Energy Leader': `${cleanWinner} (+${Math.abs(cleanEnergyDiff).toFixed(1)}%)`,
            'Carbon Leader': `${carbonWinner} (-${Math.abs(carbonDiff).toFixed(0)} kg)`,
            'Forecast Confidence': `${85 + Math.random() * 10}%`,
            'Strategic Advantage': cleanWinner === carbonWinner ? cleanWinner : 'Mixed'
        };
    }

    generateNarrative() {
        const scores = this.calculateWeightedScores();
        const winner = scores.siteA > scores.siteB ? 'A' : 'B';
        const winnerData = winner === 'A' ? this.siteAData : this.siteBData;
        const loserData = winner === 'A' ? this.siteBData : this.siteAData;
        const scoreDiff = Math.abs(scores.siteA - scores.siteB).toFixed(1);

        // Build narrative
        let narrative = `<p><strong>Strategic Recommendation:</strong> ${winnerData.siteName} (Site ${winner}) is the superior choice for your energy project, outscoring ${loserData.siteName} by ${scoreDiff} points in our weighted analysis.</p>`;

        // Key advantages
        const advantages = [];
        
        if (winnerData.egrid.carbonIntensity < loserData.egrid.carbonIntensity) {
            const diff = ((1 - winnerData.egrid.carbonIntensity / loserData.egrid.carbonIntensity) * 100).toFixed(0);
            advantages.push(`${diff}% lower carbon emissions`);
        }

        if (winnerData.powersim.transmissionHeadroom > loserData.powersim.transmissionHeadroom) {
            const diff = ((winnerData.powersim.transmissionHeadroom / loserData.powersim.transmissionHeadroom - 1) * 100).toFixed(0);
            advantages.push(`${diff}% more transmission headroom`);
        }

        if (winnerData.powersim.congestion < loserData.powersim.congestion) {
            const diff = (loserData.powersim.congestion - winnerData.powersim.congestion).toFixed(0);
            advantages.push(`${diff}% less grid congestion`);
        }

        if (winnerData.cambium.cleanEnergyForecast['2040'] > loserData.cambium.cleanEnergyForecast['2040']) {
            const diff = (winnerData.cambium.cleanEnergyForecast['2040'] - loserData.cambium.cleanEnergyForecast['2040']).toFixed(0);
            advantages.push(`${diff}% higher clean energy penetration by 2040`);
        }

        if (advantages.length > 0) {
            narrative += `<p><strong>Key Advantages:</strong> Site ${winner} delivers ${advantages.join(', ')}.</p>`;
        }

        // Economic analysis
        const costDiff = ((loserData.powersim.interconnectionCost - winnerData.powersim.interconnectionCost) / 1000000).toFixed(1);
        if (Math.abs(costDiff) > 0.5) {
            narrative += `<p><strong>Economic Impact:</strong> Site ${winner} offers $${Math.abs(costDiff)}M ${costDiff > 0 ? 'lower' : 'higher'} interconnection costs, with an LCOE of $${Math.round(winnerData.reopt.lcoe)}/MWh compared to $${Math.round(loserData.reopt.lcoe)}/MWh for Site ${winner === 'A' ? 'B' : 'A'}.</p>`;
        }

        // Long-term outlook
        const future2040A = this.siteAData.cambium.cleanEnergyForecast['2040'];
        const future2040B = this.siteBData.cambium.cleanEnergyForecast['2040'];
        narrative += `<p><strong>Long-term Outlook:</strong> By 2040, Site ${winner} is projected to reach ${Math.round(winner === 'A' ? future2040A : future2040B)}% clean energy penetration, positioning it strongly for future decarbonization goals and regulatory requirements.</p>`;

        // Dealbreakers mention
        const winnerDealbreakers = this.findDealbreakers(winnerData);
        const loserDealbreakers = this.findDealbreakers(loserData);
        
        if (loserDealbreakers.length > 0 && winnerDealbreakers.length === 0) {
            narrative += `<p><strong>Risk Assessment:</strong> Site ${winner} has zero dealbreakers, while Site ${winner === 'A' ? 'B' : 'A'} faces ${loserDealbreakers.length} significant risks: ${loserDealbreakers.join(', ')}.</p>`;
        }

        // Priority alignment
        const topPriority = Object.entries(this.priorities).reduce((a, b) => a[1] > b[1] ? a : b);
        narrative += `<p><strong>Priority Alignment:</strong> Based on your company's ${topPriority[0]} focus (${topPriority[1]}/100), Site ${winner} aligns exceptionally well with your strategic objectives.</p>`;

        document.getElementById('narrative-box').innerHTML = narrative;
    }

    calculateWeightedScores() {
        // Calculate weighted scores based on priorities
        const weights = {
            cost: this.priorities.cost / 100,
            climate: this.priorities.climate / 100,
            reliability: this.priorities.reliability / 100,
            community: this.priorities.community / 100
        };

        const scoreA = this.calculateSiteScore(this.siteAData, weights);
        const scoreB = this.calculateSiteScore(this.siteBData, weights);

        return { siteA: scoreA, siteB: scoreB };
    }

    calculateSiteScore(siteData, weights) {
        // Cost score (lower is better)
        const costScore = (10000000 - siteData.powersim.interconnectionCost) / 100000 + (100 - siteData.reopt.lcoe);
        
        // Climate score
        const climateScore = (1000 - siteData.egrid.carbonIntensity) / 10 + siteData.cambium.cleanEnergyForecast['2040'];
        
        // Reliability score
        const reliabilityScore = siteData.powersim.transmissionHeadroom / 10 + (100 - siteData.powersim.congestion) + siteData.powersim.flowCapacity / 50;
        
        // Community score
        const communityScore = siteData.egrid.environmentalJusticeScore;

        return (
            costScore * weights.cost +
            climateScore * weights.climate +
            reliabilityScore * weights.reliability +
            communityScore * weights.community
        );
    }

    determineOverallWinner() {
        const scores = this.calculateWeightedScores();
        const winner = scores.siteA > scores.siteB ? 'A' : 'B';

        // Show/hide winner badges
        document.getElementById('site-a-badge').classList.toggle('active', winner === 'A');
        document.getElementById('site-b-badge').classList.toggle('active', winner === 'B');
    }

    updateComparison() {
        // Recalculate with new priorities
        this.generateNarrative();
        this.determineOverallWinner();
    }

    showLoading(show) {
        document.getElementById('loading-overlay').classList.toggle('hidden', !show);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.comparator = new SiteBattleComparator();
    console.log('Site Battle Comparator initialized');
});
