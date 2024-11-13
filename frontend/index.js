import { backend } from 'declarations/backend';

const englishText = document.getElementById('englishText');
const targetLanguage = document.getElementById('targetLanguage');
const translatedText = document.getElementById('translatedText');
const speakButton = document.getElementById('speakButton');

let synth = window.speechSynthesis;
let voices = [];

window.addEventListener('load', () => {
    voices = synth.getVoices();
});

async function translateAndDisplay() {
    const text = englishText.value;
    const language = targetLanguage.value;
    if (text.trim() !== '') {
        try {
            const translated = await translateText(text, language);
            translatedText.textContent = translated;
        } catch (error) {
            translatedText.textContent = 'Error translating text.';
            console.error(error);
        }
    } else {
        translatedText.textContent = '';
    }
}

englishText.addEventListener('input', translateAndDisplay);
targetLanguage.addEventListener('change', translateAndDisplay);


speakButton.addEventListener('click', () => {
    const text = translatedText.textContent;
    if (text.trim() !== '') {
        const utterance = new SpeechSynthesisUtterance(text);
        if (voices.length > 0) {
            const matchingVoice = voices.find(voice => voice.lang.startsWith(targetLanguage.value));
            utterance.voice = matchingVoice || voices[0];
        }
        synth.speak(utterance);
    }
});

async function translateText(text, target) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText;
}

