const axios = require('axios');

exports.handler = async (event) => {
  const { userId } = JSON.parse(event.body);

  try {
    const response = await axios.post('http://SEU_ENDEREÇO_LOCAL_DO_BOT', { userId });

    if (response.data.member) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User is a member' }),
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'User is not a member' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error validating user' }),
    };
  }
};