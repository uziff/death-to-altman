// content.js
let phase = "image"; // Può essere "image" o "infinite"

async function runAutoPrompt() {
    // Funzione helper per attendere un determinato numero di millisecondi
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    console.log("ChatGPT Auto Prompter Avviato!");

    while (true) {
        await sleep(2000); // Controlla ogni 2 secondi

        // Cerca la textarea per inserire il prompt
        const textarea = document.querySelector('#prompt-textarea');
        if (!textarea) continue;

        // Controlla se la pagina contiene messaggi di limite raggiunto
        const pageText = document.body.innerText.toLowerCase();
        if (pageText.includes("you've reached your limit") ||
            pageText.includes('hai raggiunto il limite') ||
            pageText.includes('limit reached')) {
            if (phase !== "infinite") {
                console.log("Limite raggiunto! Cambio fase in messaggi infiniti.");
                phase = "infinite";
            }
        }

        // Cerca i bottoni per capire se ChatGPT sta attualmente generando una risposta
        const stopButton = document.querySelector('button[aria-label="Stop generating"]') ||
            document.querySelector('button[data-testid="stop-button"]');

        // Se troviamo il bottone per fermare, significa che sta ancora generando
        if (stopButton) {
            continue;
        }

        // Imposta il prompt a seconda della fase
        const promptText = phase === "image"
            ? "generami una foto di un miliardario che piange."
            : "raccontami un'altra lunghissimissima storia di come OpenAI fallirà, il più lunga che riesci";

        // Inserisce il testo nella textarea
        textarea.focus();

        // Se il testo è già quello (forse non è stato inviato), lo resettiamo
        const currentText = textarea.value !== undefined ? textarea.value : textarea.innerText;

        if (currentText.trim() !== promptText) {

            textarea.focus();

            // Se è una textarea, svuotala prima, altrimenti seleziona tutto il testo
            if (textarea.tagName.toLowerCase() === 'textarea') {
                textarea.value = '';
            } else {
                document.execCommand('selectAll', false, null);
            }

            // Simula l'inserimento umano del testo
            document.execCommand('insertText', false, promptText);

            // Fallback per sicurezza
            if (textarea.value !== undefined && textarea.value !== promptText) {
                textarea.value = promptText;
            }

            // Lancia gli eventi
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }

        await sleep(1000); // Attendi un attimo prima di cliccare invia

        // Cerca il bottone di invio che ora dovrebbe essere abilitato
        const sendBtnReady = document.querySelector('button[data-testid="send-button"]');
        if (sendBtnReady && !sendBtnReady.disabled) {
            console.log("Inviando prompt: ", promptText);
            sendBtnReady.click();

            // Attendi 5 secondi prima di ripetere il ciclo per essere sicuri che la UI sia aggiornata e la generazione iniziata
            await sleep(5000);
        }
    }
}

// Attendi 3 secondi al caricamento della pagina prima di avviare il loop
setTimeout(runAutoPrompt, 3000);
