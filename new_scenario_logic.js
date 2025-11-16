// Scenario Simulation Logic - G+ Brand

function runSimulation() {
    const locationId = document.getElementById('siteLocation').value;
    const loadMW = parseFloat(document.getElementById('loadMW').value);
    const deployType = document.getElementById('deployType').value;
    const renewableTarget = parseFloat(document.getElementById('renewableTarget').value);
    const duration = parseInt(document.getElementById('duration').value);
    const storage = document.getElementById('storage').value;
    
    if (!locationId) {
        alert('Please select a site location');
        return;
    }
    
    const site = rankedSites.find(s => {
        const id = s.name.toLowerCase().replace(/[^a-z]/g, '');
        return id.includes(locationId);
    });
    
    if (!site) {
        alert('Site data not found');
        return;
    }
    
    displaySimulationResults(site, loadMW, deployType, renewableTarget, duration, storage);
}

function displaySimulationResults(site, loadMW, deployType, renewableTarget, duration, storage) {
    const results = document.getElementById('results');
    results.style.display = 'block';
    
    // Calculate storage capacity
    let storageMW = 0;
    if (storage === 'small') storageMW = loadMW * 0.1;
    else if (storage === 'medium') storageMW = loadMW * 0.25;
    else if (storage === 'large') storageMW = loadMW * 0.5;
    
    // Calculate metrics
    const gridScore = site.score;
    const carbonEmissions = (site.carbon * loadMW * 8760) / 1000; // tons/year
    const renewableMet = Math.min(site.renewable, renewableTarget);
    const carbonReduction = carbonEmissions * (renewableMet / 100);
    const netCarbon = carbonEmissions - carbonReduction;
    
    const annualCost = site.cost * (loadMW / 100) * 1.2; // $M/year
    const lifetimeCost = annualCost * duration;
    const energyCost = site.price * loadMW * 8760 / 1000; // $k/year
    const storageCost = storageMW * 0.5; // $M
    
    const transmissionCapacity = site.transmission === 'High' ? '95%' : 
                                 site.transmission === 'Medium-High' ? '85%' :
                                 site.transmission === 'Medium' ? '75%' : '65%';
    
    const reliability = 98.5 + (site.storage / 1000) - (loadMW / 10000);
    
    // Display score card
    document.getElementById('scoreCard').innerHTML = `
        <div class="score">${gridScore.toFixed(1)}</div>
        <div class="label">Grid Compatibility Score</div>
    `;
    
    // Environmental results
    document.getElementById('envResults').innerHTML = `
        <div class="result-item"><strong>Annual Carbon Emissions:</strong><span>${carbonEmissions.toFixed(0)} tons CO2</span></div>
        <div class="result-item"><strong>Carbon Reduction:</strong><span>${carbonReduction.toFixed(0)} tons CO2</span></div>
        <div class="result-item"><strong>Net Carbon Footprint:</strong><span>${netCarbon.toFixed(0)} tons CO2</span></div>
        <div class="result-item"><strong>Renewable Energy Met:</strong><span>${renewableMet.toFixed(1)}%</span></div>
        <div class="result-item"><strong>Air Quality Index:</strong><span>${site.airQuality}</span></div>
        <div class="result-item"><strong>Carbon Intensity:</strong><span>${site.carbon} kg CO2/MWh</span></div>
    `;
    
    // Grid performance results
    document.getElementById('gridResults').innerHTML = `
        <div class="result-item"><strong>Grid Score:</strong><span>${gridScore.toFixed(1)}/100</span></div>
        <div class="result-item"><strong>Transmission Capacity:</strong><span>${transmissionCapacity}</span></div>
        <div class="result-item"><strong>Storage Available:</strong><span>${site.storage + storageMW} MW</span></div>
        <div class="result-item"><strong>Load Demand:</strong><span>${loadMW} MW</span></div>
        <div class="result-item"><strong>Network Reliability:</strong><span>${reliability.toFixed(2)}%</span></div>
        <div class="result-item"><strong>Congestion Risk:</strong><span>${site.transmission === 'High' ? 'Low' : 'Medium'}</span></div>
    `;
    
    // Economic results
    document.getElementById('ecoResults').innerHTML = `
        <div class="result-item"><strong>Project Cost:</strong><span>$${annualCost.toFixed(1)}M/year</span></div>
        <div class="result-item"><strong>Lifetime Cost:</strong><span>$${lifetimeCost.toFixed(1)}M</span></div>
        <div class="result-item"><strong>Energy Cost:</strong><span>$${energyCost.toFixed(0)}k/year</span></div>
        <div class="result-item"><strong>Storage Cost:</strong><span>$${storageCost.toFixed(1)}M</span></div>
        <div class="result-item"><strong>Wholesale Price:</strong><span>$${site.price}/MWh</span></div>
        <div class="result-item"><strong>Growth Rate:</strong><span>${site.growth}%/year</span></div>
    `;
    
    // Renewable integration results
    document.getElementById('renewResults').innerHTML = `
        <div class="result-item"><strong>Renewable Share:</strong><span>${site.renewable}%</span></div>
        <div class="result-item"><strong>Target Achievement:</strong><span>${renewableMet}% of ${renewableTarget}%</span></div>
        <div class="result-item"><strong>Solar Potential:</strong><span>${site.renewable > 60 ? 'Excellent' : 'Good'}</span></div>
        <div class="result-item"><strong>Wind Resources:</strong><span>${site.growth > 3 ? 'Available' : 'Limited'}</span></div>
        <div class="result-item"><strong>Storage Integration:</strong><span>${storage === 'none' ? 'None' : storage}</span></div>
        <div class="result-item"><strong>Incentives:</strong><span>${site.incentives.length} programs</span></div>
    `;
    
    // Recommendations
    const recommendations = [];
    
    if (netCarbon > 10000) {
        recommendations.push('Consider increasing renewable energy target to reduce carbon footprint');
    }
    
    if (storage === 'none' && loadMW > 500) {
        recommendations.push('Add battery storage to improve grid reliability and renewable integration');
    }
    
    if (site.transmission !== 'High' && loadMW > 1000) {
        recommendations.push('Evaluate transmission upgrades to support higher loads');
    }
    
    if (site.renewable < renewableTarget) {
        recommendations.push(`Site renewable capacity (${site.renewable}%) is below target (${renewableTarget}%). Consider alternative locations or hybrid solutions.`);
    }
    
    if (site.growth > 3.5) {
        recommendations.push('This region shows strong growth potential, favorable for long-term deployment');
    }
    
    if (site.incentives.includes('ITC')) {
        recommendations.push('Federal Investment Tax Credit (ITC) is available, reducing project costs by up to 30%');
    }
    
    document.getElementById('recommendations').innerHTML = `
        <h3>Recommendations</h3>
        <ul>
            ${recommendations.map(r => `<li>${r}</li>`).join('')}
            <li>Overall site ranking: #${site.rank} out of 10 evaluated locations</li>
            <li>Estimated project timeline: ${duration} years with payback in ${(duration * 0.6).toFixed(1)} years</li>
        </ul>
    `;
    
    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth' });
}

console.log('Scenario simulator logic loaded');
