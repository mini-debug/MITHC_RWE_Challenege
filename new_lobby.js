/**
 * MINIMALIST LOBBY - NAVIGATION LOGIC
 */

// Tool paths - all in minimalist folder
const TOOL_PATHS = {
    map: 'enhanced_map.html',
    scenario: 'scenario_simulator.html',
    comparator: 'comparator.html'
};

// Current step tracker
let currentStep = 1;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Grid Site Evaluation Loaded ===');
    showStep(1);
});

/**
 * Show specific step
 */
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show selected step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        currentStep = stepNumber;
    }
    
    // Update progress bar
    updateProgressBar(stepNumber);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log(`Showing step ${stepNumber}`);
}

/**
 * Update progress bar
 */
function updateProgressBar(activeStep) {
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        if (stepNum === activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

/**
 * Navigate to Map Explorer
 */
function goToMap() {
    console.log('Navigating to Map Explorer');
    window.location.href = TOOL_PATHS.map;
}

/**
 * Navigate to Scenario Simulator
 */
function goToScenario() {
    console.log('Navigating to Scenario Simulator');
    window.location.href = TOOL_PATHS.scenario;
}

/**
 * Navigate to Site Comparator
 */
function goToComparator() {
    console.log('Navigating to Site Comparator');
    window.location.href = TOOL_PATHS.comparator;
}

/**
 * Keyboard navigation
 */
document.addEventListener('keydown', function(e) {
    // Arrow right or N = Next step
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        if (currentStep < 3) {
            showStep(currentStep + 1);
        }
    }
    
    // Arrow left or P = Previous step
    if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }
    
    // Number keys 1-3 = Jump to step
    if (e.key >= '1' && e.key <= '3') {
        showStep(parseInt(e.key));
    }
});

// Export for console access
window.GridEvaluation = {
    showStep: showStep,
    goToMap: goToMap,
    goToScenario: goToScenario,
    goToComparator: goToComparator,
    currentStep: () => currentStep
};

console.log('Navigation ready. Use arrow keys or number keys (1-3) to navigate steps.');
