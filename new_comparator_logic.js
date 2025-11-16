// Site Comparison Logic - G+ Brand

function runComparison() {
    const siteAId = document.getElementById('siteA').value;
    const siteBId = document.getElementById('siteB').value;
    
    if (!siteAId || !siteBId) {
        alert('Please select both sites');
        return;
    }
    
    if (siteAId === siteBId) {
        alert('Please select different sites');
        return;
    }
    
    const siteA = rankedSites.find(s => {
        const id = s.name.toLowerCase().replace(/[^a-z]/g, '');
        return id.includes(siteAId);
    });
    
    const siteB = rankedSites.find(s => {
        const id = s.name.toLowerCase().replace(/[^a-z]/g, '');
        return id.includes(siteBId);
    });
    
    if (!siteA || !siteB) {
        alert('Site data not found');
        return;
    }
    
    displayResults(siteA, siteB);
}

function displayResults(siteA, siteB) {
    const results = document.getElementById('results');
    results.style.display = 'block';
    
    // Determine winner
    const winner = siteA.score > siteB.score ? siteA : siteB;
    const loser = siteA.score > siteB.score ? siteB : siteA;
    
    document.getElementById('winnerBanner').innerHTML = `
        🏆 WINNER: ${winner.name} (Score: ${winner.score}/100)
    `;
    
    // Site A Results
    document.getElementById('resultA').innerHTML = `
        <h3>${siteA.name}</h3>
        <div class="score">${siteA.score}/100</div>
        <div class="metric"><strong>Rank:</strong><span>#${siteA.rank}</span></div>
        <div class="metric"><strong>Carbon Intensity:</strong><span>${siteA.carbon} kg CO2/MWh</span></div>
        <div class="metric"><strong>Renewable Share:</strong><span>${siteA.renewable}%</span></div>
        <div class="metric"><strong>Air Quality:</strong><span>${siteA.airQuality}</span></div>
        <div class="metric"><strong>Transmission:</strong><span>${siteA.transmission}</span></div>
        <div class="metric"><strong>Storage:</strong><span>${siteA.storage} MW</span></div>
        <div class="metric"><strong>Demand:</strong><span>${siteA.demand.toLocaleString()} MW</span></div>
        <div class="metric"><strong>Growth Rate:</strong><span>${siteA.growth}%/yr</span></div>
        <div class="metric"><strong>Project Cost:</strong><span>$${siteA.cost}M</span></div>
        <div class="metric"><strong>Wholesale Price:</strong><span>$${siteA.price}/MWh</span></div>
    `;
    
    // Site B Results
    document.getElementById('resultB').innerHTML = `
        <h3>${siteB.name}</h3>
        <div class="score">${siteB.score}/100</div>
        <div class="metric"><strong>Rank:</strong><span>#${siteB.rank}</span></div>
        <div class="metric"><strong>Carbon Intensity:</strong><span>${siteB.carbon} kg CO2/MWh</span></div>
        <div class="metric"><strong>Renewable Share:</strong><span>${siteB.renewable}%</span></div>
        <div class="metric"><strong>Air Quality:</strong><span>${siteB.airQuality}</span></div>
        <div class="metric"><strong>Transmission:</strong><span>${siteB.transmission}</span></div>
        <div class="metric"><strong>Storage:</strong><span>${siteB.storage} MW</span></div>
        <div class="metric"><strong>Demand:</strong><span>${siteB.demand.toLocaleString()} MW</span></div>
        <div class="metric"><strong>Growth Rate:</strong><span>${siteB.growth}%/yr</span></div>
        <div class="metric"><strong>Project Cost:</strong><span>$${siteB.cost}M</span></div>
        <div class="metric"><strong>Wholesale Price:</strong><span>$${siteB.price}/MWh</span></div>
    `;
    
    // Detailed Comparison Table
    document.getElementById('metricsTable').innerHTML = `
        <h3 style="color: var(--orangey-yellow); margin-bottom: 16px;">Detailed Metrics</h3>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>${siteA.name}</th>
                    <th>${siteB.name}</th>
                    <th>Better</th>
                </tr>
            </thead>
            <tbody>
                ${generateRow('Overall Score', siteA.score, siteB.score, 'higher', '/100')}
                ${generateRow('Carbon Intensity', siteA.carbon, siteB.carbon, 'lower', ' kg CO2/MWh')}
                ${generateRow('Renewable Share', siteA.renewable, siteB.renewable, 'higher', '%')}
                ${generateRow('Air Quality Index', siteA.airQuality, siteB.airQuality, 'lower', '')}
                ${generateRow('Storage Capacity', siteA.storage, siteB.storage, 'higher', ' MW')}
                ${generateRow('Load Demand', siteA.demand, siteB.demand, 'higher', ' MW')}
                ${generateRow('Growth Rate', siteA.growth, siteB.growth, 'higher', '%/yr')}
                ${generateRow('Project Cost', siteA.cost, siteB.cost, 'lower', 'M')}
                ${generateRow('Wholesale Price', siteA.price, siteB.price, 'lower', '/MWh')}
            </tbody>
        </table>
    `;
    
    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth' });
}

function generateRow(metric, valA, valB, betterType, unit) {
    let better = '';
    if (betterType === 'higher') {
        better = valA > valB ? 'Site A' : valB > valA ? 'Site B' : 'Tie';
    } else {
        better = valA < valB ? 'Site A' : valB < valA ? 'Site B' : 'Tie';
    }
    
    return `
        <tr>
            <td><strong>${metric}</strong></td>
            <td>${valA}${unit}</td>
            <td>${valB}${unit}</td>
            <td style="font-weight: 700; color: var(--orangey-yellow);">${better}</td>
        </tr>
    `;
}

console.log('Comparator logic loaded');
