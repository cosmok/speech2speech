const ttt_worker = new Worker(new URL("./ttt-worker.js", import.meta.url), { type: "module" });


// Create a promise that will resolve when the ttt model is ready
export const tttModelReadyPromise = new Promise((resolve) => {
    window.tttModelReadyResolve = resolve;
});

const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'loading':
          // Model file start load: add a new progress item to the list.
          setStatus('loading');
          setLoadingMessage(e.data.data);
          break;

        case 'initiate':
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, ...e.data }
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          console.log("ttt model loaded successfully");
          // Resolve the promise to indicate the ttt model is ready
          window.tttModelReadyResolve();
          break;

        case 'start':
          // Start generation
          setMessages(prev => [...prev, { "role": "assistant", "content": "" }]);
          break;

        case 'response':
          console.log(e.data.data);
          break;

        case 'update': {
          // Generation update: update the output text.
          // Parse messages
          const { output, tps, numTokens } = e.data;
          setTps(tps);
          setNumTokens(numTokens)
          setMessages(prev => {
            const cloned = [...prev];
            const last = cloned.at(-1);
            cloned[cloned.length - 1] = { ...last, content: last.content + output };
            return cloned;
          });
        }
          break;

        case 'complete':
          // Generation complete: re-enable the "Generate" button
          setIsRunning(false);
          break;

        case 'error':
          console.error("TTT Worker: " + e.data);
          break;
      }
}

const onErrorReceived = (e) => { console.error("TTT Worker error " + e.toString(), e); };

ttt_worker.addEventListener("message", onMessageReceived);
ttt_worker.addEventListener("error", onErrorReceived);

