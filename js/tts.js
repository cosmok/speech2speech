import { AudioPlayer } from "./AudioPlayer.js";

const my_worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

let audioPlayer = new AudioPlayer();

// Create a promise that will resolve when the TTS model is ready
export const ttsModelReadyPromise = new Promise((resolve) => {
    window.ttsModelReadyResolve = resolve;
});

const onMessageReceived = async (e) => {
    switch (e.data.status) {
        case "ready":
            console.log("TTS model loaded successfully");
            // Resolve the promise to indicate the TTS model is ready
            window.ttsModelReadyResolve();
            break;

        case "device":
            console.log(e.data);
            break;

        case "progress":
            break;

        case "stream":
            console.log("audioPlayer.queueAudio", e.data);
            audioPlayer.queueAudio(e.data.audio);
            break;
    }
};

const onErrorReceived = (e) => { console.error("Worker error:", e); };

my_worker.addEventListener("message", onMessageReceived);
my_worker.addEventListener("error", onErrorReceived);

export function textToSpeech(text, voice) {
    if (!text || !voice) {
        console.error("Text and voice parameters are required for text-to-speech.");
        return;
    }

    if (text.lastIndexOf("Customer:") == -1) {
        console.warn("No Customer query in text: " + text);
        my_worker.postMessage({ type: "generate", text: "Thank you and wish you the best!", voice: voice });
        return text;
    }

    text = text.substring(text.lastIndexOf("Customer:") + 9);
    text = text.replaceAll("*", "");
    
    // Remove any special Markdown formatting for better speech
    text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    text = text.replace(/\*(.*?)\*/g, '$1');     // Italic
    text = text.replace(/`(.*?)`/g, '$1');       // Code
    text = text.replace(/~~(.*?)~~/g, '$1');     // Strikethrough
    text = text.replace(/Customer:/gm, ''); // Customer
    if (text.trim() !== '' && text.indexOf("Coach:") !== 0) {
	    my_worker.postMessage({ type: "generate", text: text, voice: voice });
    }
    
    return text;
}
