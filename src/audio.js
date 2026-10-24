/* Registry Ready — speech. Android app: native text-to-speech through the Capacitor bridge.
   Browser: Web Speech API. Every call returns a promise that settles when speaking ends or is stopped. */
const AUDIO = (() => {
  const cap = () => { const C = window.Capacitor; return !!(C && C.isNativePlatform && C.isNativePlatform() && typeof C.nativePromise === "function" && Array.isArray(C.PluginHeaders) && C.PluginHeaders.some(p => p && p.name === "TextToSpeech")); };
  const web = () => "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
  let rate = 1, gen = 0;
  try { rate = +localStorage.getItem("rr-rate") || 1; } catch (e) {}
  function pickVoice() {
    try {
      const v = speechSynthesis.getVoices().filter(x => /^en[-_]US/i.test(x.lang));
      return v.find(x => /natural|enhanced|premium|google/i.test(x.name)) || v[0] || null;
    } catch (e) { return null; }
  }
  function available() { return !!(cap() || web()); }
  function speak(text) {
    const my = gen;
    if (cap()) return window.Capacitor.nativePromise("TextToSpeech", "speak", { text, lang: "en-US", rate, pitch: 1, volume: 1 }).catch(() => {}).then(() => my === gen);
    if (!web()) return Promise.resolve(false);
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = rate; const v = pickVoice(); if (v) u.voice = v;
      u.onend = () => res(my === gen); u.onerror = () => res(false);
      speechSynthesis.speak(u);
    });
  }
  function stop() {
    gen++;
    if (cap()) window.Capacitor.nativePromise("TextToSpeech", "stop", {}).catch(() => {});
    else if (web()) try { speechSynthesis.cancel(); } catch (e) {}
  }
  const wait = ms => { const my = gen; return new Promise(r => setTimeout(() => r(my === gen), ms)); };
  function setRate(r) { rate = r; try { localStorage.setItem("rr-rate", String(r)); } catch (e) {} }
  return { available, speak, stop, wait, setRate, get rate() { return rate; }, get gen() { return gen; } };
})();
