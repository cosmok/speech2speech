import { SpeechToText } from "./stt.js";
import { textToSpeech, ttsModelReadyPromise } from "./tts.js";
import { processStreamingText } from "./sentence-detector.js";
import { displayConversation } from "./ui.js";



const $ = document.querySelector.bind(document);

export class Conversation {
    constructor() {
        this.modelsReady = false;
        this.speechToText = new SpeechToText();
        this.initModels();
        this.conversationHistory = [
            {
                role: "system",
                content: "placeholder"
            }
        ];
        this.initTTT();
    }

    initTTT() {
      return;
      this.ttt_worker = new Worker(new URL("./ttt-worker.js", import.meta.url), { type: "module" });
      const onErrorReceived = (e) => { console.error("TTT Worker error " + e.toString(), e); };
      this.ttt_worker.addEventListener("message", (message) =>  {
        this.tttMessageReceived(message);
      });
      this.ttt_worker.addEventListener("error", (event) => { 
         this.onErrorReceived(event);
      });
      this.ttt_worker.postMessage({type: 'load'});
    }

    tttMessageReceived(message) {
      switch  (message.data.status) {
        case "ready":
          console.log("TTT Model is ready")
          break;
      case "complete":
         console.log("TTT Response: " + message.data.output);
         this.handleTextResponse(message.data.output);
         break;
      }
    }

    async initModels() {
        try {
            await Promise.all([
                this.speechToText.modelReadyPromise,
                ttsModelReadyPromise
            ]);
            this.modelsReady = true;
            const toggleButton = document.getElementById('toggleRecording');
            toggleButton.disabled = false;
            toggleButton.textContent = 'Start Recording';
            const recordingStatus = document.getElementById('recordingStatus');
            recordingStatus.textContent = 'Models loaded. Click "Start Recording" to begin';
        } catch (error) {
            console.error('Error initializing models:', error);
            const recordingStatus = document.getElementById('recordingStatus');
            recordingStatus.textContent = 'Error loading models: ' + error.message;
        }
    }

    startRecording() {
        if (this.modelsReady) {
            this.speechToText.startRecording();
        } else {
            console.warn('Cannot start recording: models are not yet loaded');
            const recordingStatus = document.getElementById('recordingStatus');
            recordingStatus.textContent = 'Please wait for models to finish loading...';
        }
    }

    async stopRecording() {
        let text = await this.speechToText.stopRecording();
        console.log('Transcription:', text)
        $('#transcriptionStatus').textContent = text;
        this.conversationHistory.push({
            role: "user",
            content: text
        });
        await this.sendConversationHistory();
    }

    async sendConversationHistory() {
        let system_prompt = $('#systemPrompt').value;
        this.conversationHistory[0].content = system_prompt;
        await this.getTextResponse();
    }
     
    async getTextResponse() {
        let serverUrl = $('#serverUrl').value;
        let modelName = $('#modelName').value;
        const response = await fetch(serverUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                stream: false,
                model: modelName,
                temperature:0.9,
                "messages": this.conversationHistory
            })
        });
        const data = await response.json();
        const response_text = data.choices[0].message.content;
        await this.handleTextResponse(response_text);
        //this.ttt_worker.postMessage({type: "generate", data: this.conversationHistory});
      }

     async handleTextResponse(response_text) {
        //const decoder = new TextDecoder("utf-8");
        //const reader = response.body.getReader();
        let accumulatedText = "";
        const voiceSelect = document.getElementById('voiceSelect');
        const voiceId = (voiceSelect && voiceSelect.value) ? voiceSelect.value : "af_heart";

        // This section is for non-streaming mode
        try {
            this.conversationHistory.push({
                "role": "assistant",
                "content": response_text
            });
            textToSpeech(response_text, voiceId);
            console.log("response", response_text);
            displayConversation(this.conversationHistory);
        } catch (error) {
            console.log("Error parsing response as JSON, likely already processed as a stream." + error);
        }
    }
}



