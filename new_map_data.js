// Comprehensive Site Ranking Data with Real Metrics
const rankedSites = [
    {
        rank: 1, name: 'San Francisco Bay', lat: 37.7749, lng: -122.4194, score: 94.5,
        carbon: 215, renewable: 68, cost: 42.3, transmission: 'High', storage: 850,
        demand: 12400, growth: 2.8, incentives: ['ITC', 'State Rebate'], airQuality: 45, price: 38.5
    },
    {
        rank: 2, name: 'Seattle Metro', lat: 47.6062, lng: -122.3321, score: 92.1,
        carbon: 142, renewable: 82, cost: 38.7, transmission: 'High', storage: 620,
        demand: 8900, growth: 3.2, incentives: ['ITC', 'Clean Energy Fund'], airQuality: 28, price: 32.1
    },
    {
        rank: 3, name: 'Austin', lat: 30.2672, lng: -97.7431, score: 89.3,
        carbon: 312, renewable: 58, cost: 35.2, transmission: 'Medium-High', storage: 480,
        demand: 6800, growth: 4.1, incentives: ['ITC', 'Texas Solar'], airQuality: 52, price: 29.8
    },
    {
        rank: 4, name: 'Portland', lat: 45.5152, lng: -122.6784, score: 87.8,
        carbon: 168, renewable: 75, cost: 40.1, transmission: 'High', storage: 390,
        demand: 5200, growth: 2.3, incentives: ['ITC', 'OR Clean Energy'], airQuality: 34, price: 33.4
    },
    {
        rank: 5, name: 'Denver', lat: 39.7392, lng: -104.9903, score: 85.2,
        carbon: 268, renewable: 64, cost: 36.8, transmission: 'Medium', storage: 520,
        demand: 7100, growth: 3.5, incentives: ['ITC', 'CO Incentives'], airQuality: 48, price: 31.2
    },
    {
        rank: 6, name: 'Phoenix', lat: 33.4484, lng: -112.0740, score: 83.7,
        carbon: 295, renewable: 72, cost: 33.5, transmission: 'Medium', storage: 680,
        demand: 8400, growth: 3.8, incentives: ['ITC', 'AZ Solar'], airQuality: 68, price: 28.9
    },
    {
        rank: 7, name: 'Raleigh', lat: 35.7796, lng: -78.6382, score: 81.4,
        carbon: 324, renewable: 52, cost: 37.9, transmission: 'Medium', storage: 340,
        demand: 4900, growth: 3.1, incentives: ['ITC', 'NC Solar'], airQuality: 58, price: 34.7
    },
    {
        rank: 8, name: 'Chicago', lat: 41.8781, lng: -87.6298, score: 78.9,
        carbon: 318, renewable: 48, cost: 41.2, transmission: 'High', storage: 570,
        demand: 11200, growth: 1.9, incentives: ['ITC'], airQuality: 72, price: 36.5
    },
    {
        rank: 9, name: 'Atlanta', lat: 33.7490, lng: -84.3880, score: 76.5,
        carbon: 342, renewable: 45, cost: 38.6, transmission: 'Medium', storage: 410,
        demand: 9800, growth: 2.7, incentives: ['ITC', 'GA Solar'], airQuality: 64, price: 35.3
    },
    {
        rank: 10, name: 'Boston', lat: 42.3601, lng: -71.0589, score: 74.2,
        carbon: 298, renewable: 42, cost: 44.5, transmission: 'High', storage: 320,
        demand: 8700, growth: 1.6, incentives: ['ITC', 'MA SREC'], airQuality: 56, price: 42.1
    }
];

// Transmission lines data
const transmissionLines = [
    {name: 'CA-NV Corridor', coords: [[36.7783, -119.4179], [38.8026, -116.4194]], capacity: 4200, voltage: 500},
    {name: 'TX-OK Corridor', coords: [[31.9686, -99.9018], [35.0078, -97.0929]], capacity: 3800, voltage: 345},
    {name: 'NY-NJ Corridor', coords: [[40.7128, -74.0060], [40.0583, -74.4057]], capacity: 5100, voltage: 500},
    {name: 'WA-OR Corridor', coords: [[47.6062, -122.3321], [45.5152, -122.6784]], capacity: 4600, voltage: 500}
];

// Solar potential sites
const solarSites = [
    {name: 'CA Solar Belt', lat: 35.3733, lng: -119.0187, capacity: 15800, cf: 28},
    {name: 'AZ Sun Corridor', lat: 33.4484, lng: -112.0740, capacity: 11200, cf: 32},
    {name: 'TX Panhandle', lat: 35.2226, lng: -101.8313, capacity: 9400, cf: 26}
];

// Wind resources
const windSites = [
    {name: 'TX Wind Belt', lat: 31.9686, lng: -99.9018, capacity: 24600, cf: 42},
    {name: 'Midwest Wind', lat: 41.8781, lng: -93.0977, capacity: 12400, cf: 38},
    {name: 'Pacific Northwest', lat: 47.6062, lng: -120.3321, capacity: 8900, cf: 35}
];

// Storage facilities
const storageFacilities = [
    {name: 'SF Bay Storage', lat: 37.7749, lng: -122.4194, capacity: 850, type: 'Li-ion'},
    {name: 'Phoenix Battery', lat: 33.4484, lng: -112.0740, capacity: 680, type: 'Li-ion'},
    {name: 'Seattle Storage', lat: 47.6062, lng: -122.3321, capacity: 620, type: 'Flow'}
];

// Congestion zones
const congestionZones = [
    {name: 'LA Basin Congestion', lat: 34.0522, lng: -118.2437, severity: 'High', cost: 12.5},
    {name: 'NYC Metro', lat: 40.7128, lng: -74.0060, severity: 'High', cost: 15.2},
    {name: 'Chicago Loop', lat: 41.8781, lng: -87.6298, severity: 'Medium', cost: 8.3}
];

// Hydro sites
const hydroSites = [
    {name: 'Pacific Northwest Hydro', lat: 46.2, lng: -121.5, capacity: 18500, type: 'Run-of-river'},
    {name: 'Columbia River', lat: 45.8, lng: -120.8, capacity: 12400, type: 'Dam'},
    {name: 'Snake River', lat: 46.5, lng: -117.2, capacity: 6200, type: 'Dam'}
];

// Geothermal sites
const geothermalSites = [
    {name: 'The Geysers', lat: 38.78, lng: -122.82, capacity: 1520, temp: 240},
    {name: 'Nevada Geothermal', lat: 40.15, lng: -118.95, capacity: 480, temp: 180},
    {name: 'Utah Geothermal', lat: 38.52, lng: -112.33, capacity: 320, temp: 165}
];

// Carbon intensity zones (colored by intensity)
const carbonZones = [
    {name: 'California Clean', lat: 36.7783, lng: -119.4179, intensity: 215, level: 'low'},
    {name: 'Texas Mixed', lat: 31.9686, lng: -99.9018, intensity: 385, level: 'medium'},
    {name: 'Coal Belt', lat: 39.8, lng: -86.15, intensity: 520, level: 'high'}
];

// Emissions zones
const emissionsZones = [
    {name: 'Industrial Midwest', lat: 41.5, lng: -87.8, emissions: 12500, pollutants: ['SO2', 'NOx']},
    {name: 'Gulf Coast', lat: 29.7, lng: -95.3, emissions: 18200, pollutants: ['SO2', 'NOx', 'PM2.5']},
    {name: 'Ohio Valley', lat: 38.4, lng: -82.4, emissions: 14800, pollutants: ['SO2', 'NOx']}
];

// Air quality monitoring
const airQualitySites = [
    {name: 'Seattle Clean Air', lat: 47.6062, lng: -122.3321, aqi: 28, quality: 'Good'},
    {name: 'SF Bay Quality', lat: 37.7749, lng: -122.4194, aqi: 45, quality: 'Good'},
    {name: 'Phoenix AQI', lat: 33.4484, lng: -112.0740, aqi: 68, quality: 'Moderate'},
    {name: 'Atlanta Monitor', lat: 33.7490, lng: -84.3880, aqi: 64, quality: 'Moderate'}
];

// Wholesale price zones
const priceZones = [
    {name: 'CAISO NP15', lat: 38.5, lng: -121.5, price: 38.5, trend: 'stable'},
    {name: 'ERCOT West', lat: 31.8, lng: -102.4, price: 29.8, trend: 'declining'},
    {name: 'PJM West', lat: 40.2, lng: -80.2, price: 36.5, trend: 'rising'}
];

// Cost curve locations
const costLocations = [
    {name: 'Low Cost Zone', lat: 33.4, lng: -111.9, lcoe: 28, type: 'Solar+Storage'},
    {name: 'Medium Cost', lat: 39.7, lng: -104.9, lcoe: 36, type: 'Wind+Solar'},
    {name: 'Premium Zone', lat: 42.3, lng: -71.0, lcoe: 44, type: 'Offshore Wind'}
];

// Tax incentive zones
const incentiveZones = [
    {name: 'CA SGIP', lat: 37.5, lng: -121.9, program: 'State Rebate', value: '30%'},
    {name: 'TX Solar Credit', lat: 30.3, lng: -97.7, program: 'Property Tax', value: '100%'},
    {name: 'Federal ITC', lat: 38.9, lng: -77.0, program: 'Investment Tax', value: '30%'}
];

// Load centers (demand)
const loadCenters = rankedSites.map(site => ({
    name: site.name,
    lat: site.lat,
    lng: site.lng,
    demand: site.demand,
    peak: site.demand * 1.3
}));

// Growth projection zones
const growthZones = [
    {name: 'Austin Growth', lat: 30.2672, lng: -97.7431, rate: 4.1, projection: '+18% by 2030'},
    {name: 'Phoenix Growth', lat: 33.4484, lng: -112.0740, rate: 3.8, projection: '+16% by 2030'},
    {name: 'Denver Growth', lat: 39.7392, lng: -104.9903, rate: 3.5, projection: '+15% by 2030'}
];

// Industrial zones
const industrialZones = [
    {name: 'Silicon Valley', lat: 37.4, lng: -122.0, type: 'Tech/Data Centers', load: 3200},
    {name: 'Houston Industrial', lat: 29.7604, lng: -95.3698, type: 'Petrochemical', load: 5600},
    {name: 'Chicago Mfg', lat: 41.8781, lng: -87.6298, type: 'Manufacturing', load: 4200}
];

// Pumped hydro storage
const pumpedHydroSites = [
    {name: 'Raccoon Mountain', lat: 35.05, lng: -85.4, capacity: 1652, reservoir: 'Upper'},
    {name: 'Bath County', lat: 38.25, lng: -79.8, capacity: 3003, reservoir: 'Upper'},
    {name: 'Northfield Mountain', lat: 42.6, lng: -72.45, capacity: 1168, reservoir: 'Upper'}
];
