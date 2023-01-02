import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Savant!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on https://savantai.onrender.com'))
//This code contains several comments that provide information about the parameters being set for an AI model.

//The first comment explains that a higher value for the "max_tokens" parameter means that the model will take more risks in its output.

//The second comment states that the "max_tokens" parameter determines the maximum number of tokens (small units of meaning, such as words or punctuation) that the model will generate in its output.

//The third comment explains that the "top_p" parameter is an alternative to using the "temperature" parameter when sampling output from the model.

//The fourth comment states that the "frequency_penalty" parameter is a number between -2.0 and 2.0 that penalizes new tokens based on their existing frequency in the text being generated, which decreases the model's likelihood to repeat the same line verbatim.

//The final comment explains that the "presence_penalty" parameter is a number between -2.0 and 2.0 that penalizes new tokens based on whether they appear in the text being generated, which increases the model's likelihood to talk about new topics.
