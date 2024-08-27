const openai = require('../config/openai');

// Function to analyze sentiment using OpenAI
async function analyzeSentiment(text) {
    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: `
You are an advanced sentiment analysis engine. Your task is to analyze the sentiment of the following text with a high degree of accuracy. Consider the tone, context, and specific language used. Based on your analysis, classify the sentiment using one of the following labels:

1. "Very Positive" - Strong approval and enthusiasm.
2. "Positive" - Clear positive sentiment with satisfaction.
3. "Slightly Positive" - Mildly positive, indicating some favorable aspects.
4. "Neutral" - Factual or balanced in sentiment, without strong emotion.
5. "Slightly Negative" - Mild dissatisfaction or minor issues.
6. "Negative" - Clear negative sentiment, indicating dissatisfaction or frustration.
7. "Very Negative" - Strong disapproval, frustration, anger, or significant disappointment.

Now, analyze the sentiment of the following text and return the most appropriate label:

"${text}"

Response:`,
            max_tokens: 20,
            temperature: 0,
        });

        const sentiment = response.choices[0].text.trim();

        // Convert the sentiment label to a score
        let score;
        switch (sentiment.toLowerCase()) {
            case 'very negative':
                score = -1.0;
                break;
            case 'negative':
                score = -0.7;
                break;
            case 'slightly negative':
                score = -0.4;
                break;
            case 'neutral':
                score = 0.0;
                break;
            case 'slightly positive':
                score = 0.4;
                break;
            case 'positive':
                score = 0.7;
                break;
            case 'very positive':
                score = 1.0;
                break;
            default:
                score = 0.0; // If the sentiment is unknown, default to neutral
                break;
        }

        return {
            label: sentiment,
            score: score,
        };
    } catch (error) {
        console.error('Error analyzing sentiment with OpenAI:', error.message);
        return {
            label: 'UNKNOWN',
            score: 0,
        };
    }
}

// Function to analyze sentiment and assign an urgency level
async function analyzeSentimentAndAssignUrgency(text) {
    const sentimentAnalysis = await analyzeSentiment(text); // Analyze sentiment and get score and label

    let urgencyLevel;
    if (sentimentAnalysis.score <= -0.7) {
        urgencyLevel = 3; // Critical
    } else if (sentimentAnalysis.score <= -0.4) {
        urgencyLevel = 2; // High
    } else if (sentimentAnalysis.score < 0) {
        urgencyLevel = 1; // Medium
    } else {
        urgencyLevel = 0; // No urgency
    }

    return {
        sentiment: sentimentAnalysis.label,  // e.g., 'Very Negative'
        urgency: urgencyLevel,
    };
}

module.exports = {
    analyzeSentimentAndAssignUrgency,
};
