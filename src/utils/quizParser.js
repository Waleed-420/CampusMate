export const parseQuizResponse = (apiResponse) => {
  try {
    let content;
    
    if (typeof apiResponse === 'string') {
      try {
        content = JSON.parse(apiResponse);
      } catch (e) {
        const jsonMatch = apiResponse.match(/(\{.*\}|\[.*\])/s);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Response is not valid JSON');
        }
      }
    } else if (apiResponse?.choices?.[0]?.message?.content) {
      content = apiResponse.choices[0].message.content;
      if (typeof content === 'string') {
        try {
          content = JSON.parse(content);
        } catch (e) {
          const jsonMatch = content.match(/(\{.*\}|\[.*\])/s);
          if (jsonMatch) {
            content = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Content is not valid JSON');
          }
        }
      }
    } else {
      content = apiResponse;
    }

    let questions;
    if (Array.isArray(content)) {
      questions = content;
    } else if (Array.isArray(content?.questions)) {
      questions = content.questions;
    } else if (Array.isArray(content?.quiz)) {
      questions = content.quiz;
    } else if (typeof content === 'object' && content !== null) {
      const arrayKeys = Object.keys(content).filter(key => Array.isArray(content[key]));
      if (arrayKeys.length === 1) {
        questions = content[arrayKeys[0]];
      } else {
        throw new Error('Could not find questions array in response');
      }
    } else {
      throw new Error('Response does not contain valid questions');
    }

    validateQuizQuestions(questions);
    return questions;
    
  } catch (error) {
    console.error('Quiz parsing error:', error);
    throw new Error(`Failed to parse quiz data: ${error.message}`);
  }
};

export const validateQuizQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new Error('Questions must be an array');
  }

  if (questions.length === 0) {
    throw new Error('Questions array is empty');
  }

  questions.forEach((question, index) => {
    if (!question || typeof question !== 'object') {
      throw new Error(`Question ${index + 1} is not an object`);
    }
    
    if (!question.question || typeof question.question !== 'string') {
      throw new Error(`Question ${index + 1} is missing or has invalid text`);
    }
    
    if (!question.options || !Array.isArray(question.options)) {
      throw new Error(`Question ${index + 1} is missing options array`);
    }
    
    if (question.options.length < 2) {
      throw new Error(`Question ${index + 1} needs at least 2 options`);
    }
    
    question.options.forEach((option, optIndex) => {
      if (typeof option !== 'string') {
        throw new Error(`Question ${index + 1}, option ${optIndex + 1} is not a string`);
      }
    });
  });
};