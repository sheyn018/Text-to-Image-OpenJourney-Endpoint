const express = require('express');
const axios = require('axios');
const { HfInference } = require('@huggingface/inference');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
// Define the previous route
// app.get('/', (req, res) => res.send('Express on Vercel'));

app.post('/', async (req, res) => {
    console.log('Request received:', req.body);
  const {
    token,
    model = 'prompthero/openjourney-v4',
    prompt,
    parameters,
  } = req.body;

  if (!prompt) {
    return res.status(400).send('Missing required parameters: prompt');
  }

  const inference = new HfInference(token);

  try {
    const blob = await inference.textToImage({
      model: model,
      inputs: prompt,
      parameters: parameters,
    });
    const buffer = await blob.arrayBuffer();
    const base64data = Buffer.from(buffer).toString('base64');
    const img = `data:${blob.type};base64,${base64data}`;

    res.json({ buffer: img });
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).send(`Error generating the image: ${error.message}`);
  }
});

// Start the server
const port = 3800; // Change the port if needed
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
