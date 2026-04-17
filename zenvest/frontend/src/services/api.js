// Mocking API service as requested to bypass backend dependency
export const getRiskSignals = async (city) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    zoneRisk: "Low",
    weatherRisk: 3,
    aqiRisk: 4,
    trustScore: 88,
  };
};

export const predictRisk = async (payload) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    prediction: {
      risk_label: "Low",
      risk_score: 26,
      explanation: "Based on your high trust score and low-exposure zone, you have been classified as a low-risk rider.",
      trust_score: 88,
      score_breakdown: [
        { name: 'Safety History', pct: 92, description: 'Excellent claim-free record' },
        { name: 'Zone Exposure', pct: 15, description: 'Operating in a safe, green-lit zone' },
        { name: 'Work Habits',   pct: 40, description: 'Consistent weekly hours' },
      ],
      suggestions: [
        'Maintain your 8-month tenure for lower premiums',
        'Your trust score qualifies you for priority claims',
      ],
      available_plans: [
        {
          id: 'basic-low',
          name: 'Zenvest Basic',
          weeklyPremium: 99,
          coverage: '₹50,000',
          badge: 'Essential',
          recommended: true,
          features: ['Accident Cover', '24/7 Support', 'GST included'],
          triggerPayouts: { rain: 200, aqi: 150 }
        },
        {
          id: 'smart-low',
          name: 'Zenvest Smart',
          weeklyPremium: 149,
          coverage: '₹1,00,000',
          badge: 'Best Value',
          recommended: false,
          features: ['Everything in Basic', 'Weather Cover', 'Income Protection'],
          triggerPayouts: { rain: 500, aqi: 400, heat: 300 }
        },
        {
          id: 'plus-low',
          name: 'Protection Plus',
          weeklyPremium: 249,
          coverage: '₹2,00,000',
          badge: 'Maximum Cover',
          recommended: false,
          features: ['Everything in Smart', 'Critical Illness', 'Family Cover', 'Legal Aid'],
          triggerPayouts: { rain: 1000, aqi: 800, heat: 600, wind: 400 }
        }
      ],

      recommended_plan_id: 'basic-low',
      // Legacy support for StepResult component in RegisterPageNew
      recommended_plan: {
        name: "Zenvest Basic Rider",
        tagline: "Essential protection for safe, high-trust riders.",
        premium: "₹99/week",
        coverage: "₹50,000",
        features: [
          "Personal Accident Cover",
          "Basic Hospitalisation",
          "24/7 Multi-lingual Helpline",
          "Daily Cash Benefit (3 days)"
        ],
        badge: "Most Secure Choice"
      }
    }
  };
};



