export function playAudio(audioFile) {
    if (!audioFile) {
        console.error("No se proporcionó un archivo de audio.");
        return;
    }

    const audio = new Audio(audioFile);
    audio.play();
}