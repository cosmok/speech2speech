# Speech2Speech

A web application that converts speech to text, processes it through an AI language model, and converts the response back to speech using advanced text-to-speech technology.

This all happens in the local browser, nothing is sent to any server.

Important: You NEED a local running chat LLM server like llama-server

## Features

- **Speech Recognition**: Uses Moonshine to transcribe spoken english language only into text
- **AI Processing**: Sends transcribed text to a language model API for intelligent responses
- **Text-to-Speech**: Converts the AI response back to speech using Kokoro TTS
- **Dark Mode**: Modern dark-themed UI for comfortable use

## Technologies Used

- **Moonshine**: Speech recognition model by Useful Sensors
- **Kokoro**: Advanced text-to-speech synthesis engine
- **Hugging Face Transformers.js**: Client-side machine learning models
- **Web Audio API**: For audio recording and playback
- **Modern JavaScript**: ES6+ features including modules, classes, and async/await

## Getting Started

### Prerequisites

- Modern web browser with JavaScript AND WebGPU enabled
- Local or remote server to host the application
- Optional: Web server that supports the language model API endpoint

### Installation

1. Clone the repository
2. Host the files on a web server
3. Open the application in a web browser

### Configuration

In the Settings tab:
- Set the Chat Inference Server URL to your language model endpoint
- Configure the System Prompt to control the AI assistant's behavior

Example Prompt, **Sales Coach**:
```
You are helping me practice a sales call.

I am always the Seller.
Every message I send is a Seller message to the prospect.
Never treat my messages as coming from the Customer.

You will play two roles:
1. Customer — the prospect I am selling to.
2. Coach — private feedback for me, the Seller.

After each Seller message I send, reply with exactly two lines:

Customer: [Respond as the prospect to my latest Seller message only.]
Coach: [Give private coaching feedback to me, the Seller, about my latest Seller message only.]

Critical rules:
- I am never the Customer.
- Do not coach the Customer.
- Do not respond to the Customer as if they are me.
- The Coach must evaluate only my latest Seller message.
- The Customer must respond only to my latest Seller message.
- The Customer must not use or react to Coach feedback.
- Generate the Customer line before the Coach line.
- Customer response must contain only one realistic point.
- Customer response may contain questions, objections, current pain points, pricing, can't they do this themselves etc.
- Coach response must include one thing I did right and one better next move or phrase.
- Keep the total response under 400 characters.
- No headings, bullets, explanations, or extra text.

Service context:
GCP Cost Visibility Setup is a fixed-scope setup for GCP billing export, dashboards, alerts, recommendation review and handover for startups and small product teams.

Good example:
Seller: How are you currently reviewing GCP costs?
Customer: Mostly our CTO checks the bill when it spikes.
Coach: Good discovery question. Next, ask who owns the monthly review habit.

Bad example:
Seller: How much are you charging?
Customer: It depends on scope and project count.
Coach: You asked a good pricing question.
```

## How to Use

1. Navigate to the Conversation tab
2. Click "Start Recording" to begin speaking
3. Click "Stop Recording" when finished to process the audio
4. Wait for the AI to generate a response
5. The response will be spoken aloud using the selected voice
6. View the conversation history in the Transcription section

## Project Structure

- `/css`: Stylesheet files for the UI
- `/js`: JavaScript modules for application logic
  - `AudioPlayer.js`: Handles audio playback
  - `conversation.js`: Manages the conversation flow
  - `kokoro.js`: Text-to-speech implementation
  - `stt.js`: Speech-to-text functionality
  - `ui.js`: User interface interactions
- `/index.html`: Main application page

## Credits

This project uses the following open source technologies:

- [Moonshine](https://github.com/usefulsensors/moonshine) - Speech recognition model by Useful Sensors
- [Kokoro](https://github.com/hexgrad/kokoro) - Text-to-speech synthesis engine
- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) - Machine learning models in the browser

## License

Apache 2.0

