export const parseQuizResponse = (apiResponse) => {
  try {
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }

    if (typeof apiResponse === 'string') {
      try {
        const parsed = JSON.parse(apiResponse);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        const jsonMatch = apiResponse.match(/\[.*\]/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    }

    if (typeof apiResponse === 'object' && apiResponse !== null) {
      if (apiResponse.choices?.[0]?.message?.content) {
        return parseQuizResponse(apiResponse.choices[0].message.content);
      }

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
