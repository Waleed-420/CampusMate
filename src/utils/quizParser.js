/**
 * Parses quiz data from API responses with multiple fallback methods
 * @param {string|object} apiResponse - The raw API response
 * @returns {Array} - Parsed quiz questions
 * @throws {Error} - If parsing fails
 */
export const parseQuizResponse = (apiResponse) => {
  try {
    // If the response is already an array, return it directly
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }

    // If the response is a string that looks like JSON
    if (typeof apiResponse === 'string') {
      // First try to parse directly
      try {
        const parsed = JSON.parse(apiResponse);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // If direct parse fails, try to extract JSON from the string
        const jsonMatch = apiResponse.match(/\[.*\]/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    }

    // If the response is an object, look for common structures
    if (typeof apiResponse === 'object' && apiResponse !== null) {
      // Check for OpenRouter's response structure
      if (apiResponse.choices?.[0]?.message?.content) {
        return parseQuizResponse(apiResponse.choices[0].message.content);
      }

      // Check if the object itself contains questions
      if (apiResponse.questions || apiResponse.quiz) {
        return apiResponse.questions || apiResponse.quiz;
      }
    }

    throw new Error('Unable to parse quiz data from response');
  } catch (error) {
    console.error('Quiz parsing error:', error);
    throw new Error(`Failed to parse quiz data: ${error.message}`);
  }
};

/**
 * Validates the quiz question structure
 * @param {Array} questions - Questions to validate
 * @throws {Error} - If validation fails
 */
export const validateQuizQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new Error('Questions must be an array');
  }

  questions.forEach((question, index) => {
    if (!question.question || typeof question.question !== 'string') {
      throw new Error(`Question ${index + 1} is missing text`);
    }
    if (!question.options || !Array.isArray(question.options)) {
      throw new Error(`Question ${index + 1} is missing options array`);
    }
    if (question.options.length < 2) {
      throw new Error(`Question ${index + 1} needs at least 2 options`);
    }
  });
};