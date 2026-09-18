import React,{useEffect,useMemo,useState} from "react";
import {Shell} from "./components/layout/Shell";
import {extractAdvisoryText} from "./utils/crai";
import useCRAI from "./hooks/useCRAI";

import Overview from "./pages/Overview";
import Observe from "./pages/Observe";
import Intelligence from "./pages/Intelligence";
import Sensors from "./pages/Sensors";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App(){

  const crai = useCRAI();

  const [page,setPage] = useState("overview");
  const [file, setFile] = useState(null);
const [preview, setPreview] = useState("");

  const [settings,setSettings] = useState(()=>{
    try{
      return JSON.parse(
        localStorage.getItem("crai.settings.v4") ||
        '{"language":"English","compact":true,"offlineCues":true}'
      );
    }catch{
      return {
        language:"English",
        compact:true,
        offlineCues:true
      };
    }
  });

  const [form,setForm] = useState({
    zoneId:"A1",
    crop:"Tomato",
    growthStage:"Vegetative",
    advisoryLanguage:settings.language || "English"
  });

  const [advisoryPlaying,setAdvisoryPlaying] = useState(false);
  const [advisoryError,setAdvisoryError] = useState("");

  /*
   * Local preview for the selected image.
   */
  useEffect(() => {
  if (!file) {
    setPreview("");
    return;
  }

  const url = URL.createObjectURL(file);
  setPreview(url);

  return () => {
    URL.revokeObjectURL(url);
  };
}, [file]);

  /*
   * Persist settings.
   */
  useEffect(()=>{
    localStorage.setItem(
      "crai.settings.v4",
      JSON.stringify(settings)
    );
  },[settings]);

  /*
   * Application navigation events.
   */
  useEffect(()=>{
    const fn = e => {
      if(e.detail){
        setPage(e.detail);
      }
    };

    window.addEventListener("crai:navigate",fn);

    return ()=>{
      window.removeEventListener("crai:navigate",fn);
    };
  },[]);

  /*
   * ============================================================
   * AUTOMATIC PHONE/LAPTOP ANALYSIS
   *
   * As soon as an image is captured/selected:
   *
   * Phone camera
   *      ↓
   * file state
   *      ↓
   * CRAI analysis
   *      ↓
   * completed result
   *      ↓
   * Field Intelligence
   *
   * No "Run CRAI analysis" click required.
   * ============================================================
   */
  useEffect(()=>{

  if(!file){
    return;
  }

  if(crai.running){
    return;
  }

  if(page !== "observe"){
    return;
  }

  let cancelled = false;

  const autoAnalyze = async()=>{

    try{

      console.log(
        "[CRAI] Automatic image analysis started."
      );

      /*
       * ========================================================
       * FIRST PASS
       *
       * Phone image -> CRAI
       * ========================================================
       */

      const first =
        await crai.analyze(
          form,
          file
        );

      if(cancelled){
        return;
      }


      const firstAnalysis =
        first?.analysis &&
        typeof first.analysis === "object"
          ? first.analysis
          : first;


      const firstAdaptive =
        first?.adaptive_evidence ||
        first?.adaptive ||
        firstAnalysis?.adaptive_evidence ||
        firstAnalysis?.adaptive ||
        crai.adaptive ||
        {};


      const firstAction =
        String(
          firstAdaptive?.action ||
          firstAnalysis?.decision?.action ||
          first?.decision?.action ||
          ""
        ).toUpperCase();


      const firstRisk =
        first?.risk ||
        firstAnalysis?.risk;


      /*
       * ========================================================
       * CASE 1
       *
       * CRAI already has enough evidence.
       * ========================================================
       */

      if(firstRisk){

        console.log(
          "[CRAI] Completed on first pass.",
          firstRisk
        );

        setPage("intelligence");

        return;
      }


      /*
       * ========================================================
       * CASE 2
       *
       * CRAI requests fresh environmental evidence.
       *
       * AUTOMATICALLY START ESP32 ACQUISITION.
       * ========================================================
       */
      /*
 * ========================================================
 * VISUAL EVIDENCE GATE
 *
 * If CRAI needs another image, stay on Observe.
 * Do NOT open Field Intelligence.
 * ========================================================
 */

if(
  firstAction.includes("REQUEST_IMAGE") ||
  firstAction.includes("SECOND_IMAGE") ||
  firstAdaptive?.evidence_required === "SECOND_IMAGE" ||
  firstAdaptive?.requested_evidence?.includes?.("SECOND_IMAGE")
){

  console.log(
    "[CRAI] Second image required before risk calculation."
  );

  setPage("observe");

  return;
}
      if(
        firstAction.includes(
          "REQUEST_SENSOR"
        ) ||
        firstAction.includes(
          "FRESH_ENVIRONMENTAL"
        ) ||
        firstAdaptive?.required_evidence ===
          "FRESH_ENVIRONMENTAL"
      ){

        console.log(
          "[CRAI] Fresh environmental evidence required."
        );


        /*
         * Ask the physical ESP32 for a new reading.
         */
        const completed =
          await crai.acquireSensor(
            form.zoneId,
            async()=>{

              if(cancelled){
                return null;
              }


              console.log(
                "[CRAI] Fresh ESP32 reading received."
              );


              /*
               * ==================================================
               * SECOND PASS
               *
               * SAME PHONE IMAGE
               * +
               * NEW ESP32 SENSOR READING
               *
               * -> CRAI FUSION
               * ==================================================
               */

              const second =
                await crai.analyze(
                  form,
                  file
                );


              console.log(
                "[CRAI] Re-analysis completed.",
                second
              );


              return second;

            }
          );


        if(cancelled){
          return;
        }


        /*
         * ======================================================
         * FINAL RESULT
         * ======================================================
         */

        const finalRisk =
          completed?.risk ||
          completed?.analysis?.risk ||
          crai.result?.risk;


        if(finalRisk){

          console.log(
            "[CRAI] FINAL DETERMINISTIC RISK:",
            finalRisk
          );

          setPage("intelligence");

          return;
        }


        /*
         * If somehow still incomplete,
         * remain on Observe.
         */

        console.log(
          "[CRAI] Sensor acquisition finished but assessment is not ready."
        );

        setPage("observe");

        return;
      }


      /*
       * ========================================================
       * CASE 3
       *
       * No completed result and no explicit sensor request.
       * ========================================================
       */

      console.log(
        "[CRAI] Analysis returned without a completed risk."
      );

      setPage("observe");

    }catch(error){

      console.error(
        "[CRAI] Automatic analysis failed:",
        error
      );

    }

  };


  autoAnalyze();


  return ()=>{

    cancelled = true;

  };

},[file]);
  /*
   * Manual analysis button still works.
   */
  async function runAnalysis(){

    try{

      const r = await crai.analyze(form,file);

      const analysis =
        r?.analysis &&
        typeof r.analysis === "object"
          ? r.analysis
          : r;

      const adaptive =
        r?.adaptive_evidence ||
        r?.adaptive ||
        analysis?.adaptive_evidence ||
        analysis?.adaptive ||
        crai.adaptive;

      const action =
        String(
          adaptive?.action ||
          analysis?.decision?.action ||
          r?.decision?.action ||
          ""
        ).toUpperCase();

      const risk =
        r?.risk ||
        analysis?.risk;

      /*
       * CRAI needs another sensor reading.
       */
      if(
        action.includes("REQUEST_SENSOR") &&
        !risk
      ){
        setPage("observe");
        return;
      }

      /*
       * Completed CRAI assessment.
       */
      if(risk){
        setPage("intelligence");
        return;
      }

      setPage("observe");

    }catch(error){

      console.error(
        "CRAI analysis failed:",
        error
      );

    }
  }

  function selectZone(id){

    setForm(f=>({
      ...f,
      zoneId:id
    }));

    if(
      crai.result?.context?.zone_id === id &&
      crai.result?.risk
    ){
      setPage("intelligence");
    }else{
      setPage("observe");
    }
  }

  /*
   * ============================================================
   * ADVISORY AUDIO
   * ============================================================
   */

  function playAdvisory(
    text,
    requestedLanguage=form.advisoryLanguage
  ){

    const currentAdvisory =
      extractAdvisoryText(
        crai.result?.advisory
      );

    const spoken =
      extractAdvisoryText(text) ||
      currentAdvisory;

    setAdvisoryError("");

    if(!spoken){

      setAdvisoryError(
        "No advisory text is available to play."
      );

      return;
    }

    if(
      !window.speechSynthesis ||
      typeof window.SpeechSynthesisUtterance !== "function"
    ){

      setAdvisoryError(
        "Chrome speech synthesis is unavailable."
      );

      return;
    }

    const synth =
      window.speechSynthesis;

    synth.cancel();

    const selected =
      String(
        requestedLanguage || "English"
      );

    const lang =
      selected === "Tamil"
        ? "ta-IN"
        : selected === "Hindi"
          ? "hi-IN"
          : "en-IN";

    const voices =
      synth.getVoices
        ? synth.getVoices()
        : [];

    const voice =
      voices.find(
        v =>
          String(v.lang || "")
            .toLowerCase() ===
          lang.toLowerCase()
      ) ||
      voices.find(
        v =>
          String(v.lang || "")
            .toLowerCase()
            .startsWith(
              lang.slice(0,2).toLowerCase()
            )
      ) ||
      (
        selected === "English"
          ? voices.find(
              v =>
                String(v.lang || "")
                  .toLowerCase()
                  .startsWith("en")
            )
          : null
      );

    const chunks =
      spoken
        .replace(/\s+/g," ")
        .trim()
        .match(/.{1,180}(?:\s+|$)/g) ||
      [spoken];

    let index = 0;

    const speakNext = ()=>{

      if(index >= chunks.length){

        setAdvisoryPlaying(false);

        return;
      }

      const utterance =
        new window.SpeechSynthesisUtterance(
          chunks[index++]
        );

      utterance.lang = lang;

      if(voice){
        utterance.voice = voice;
      }

      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = ()=>{
        setAdvisoryPlaying(true);
      };

      utterance.onend = ()=>{

        if(index < chunks.length){

          try{
            synth.resume();
          }catch{}

          window.setTimeout(
            speakNext,
            20
          );

        }else{

          setAdvisoryPlaying(false);

        }
      };

      utterance.onerror = event =>{

        setAdvisoryPlaying(false);

        const code =
          String(event?.error || "");

        if(
          code !== "canceled" &&
          code !== "interrupted"
        ){

          setAdvisoryError(
            `Speech playback failed (${code || "unknown error"}).`
          );

        }
      };

      try{

        synth.resume();
        synth.speak(utterance);

      }catch(error){

        setAdvisoryPlaying(false);

        setAdvisoryError(
          `Speech playback could not start: ${
            error?.message || "browser error"
          }`
        );

      }
    };

    speakNext();
  }

  function stopAdvisory(){

    if("speechSynthesis" in window){

      window.speechSynthesis.cancel();

    }

    setAdvisoryPlaying(false);
  }

  async function regenerateAdvisory(
    nextForm=form
  ){

    if(!file){

      setAdvisoryError(
        "The original observation image is not available after a page reload."
      );

      return;
    }

    setAdvisoryError("");

    try{

      const r =
        await crai.regenerateAdvisory(
          nextForm,
          file
        );

      if(r?.risk){

        setPage("intelligence");

      }

    }catch(error){

      setAdvisoryError(
        error?.message ||
        "Could not regenerate the advisory."
      );

    }
  }

  async function changeAdvisoryLanguage(
    value
  ){

    const next = {
      ...form,
      advisoryLanguage:value
    };

    setForm(next);

    setSettings(s=>({
      ...s,
      language:value
    }));

    if(crai.result?.risk){

      await regenerateAdvisory(next);

    }
  }

  /*
   * Latest advisory.
   */
  const currentAdvisory =
    useMemo(
      () =>
        extractAdvisoryText(
          crai.result?.advisory
        ),
      [crai.result]
    );

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
    const system = {
    backend: crai.backend,
    ai: crai.ai,
    sensor: crai.sensorOnline
  };
  return (

    <Shell
      page={page}
      setPage={setPage}
      system={system}
      onRefresh={crai.refreshAll}
      refreshing={crai.refreshing}
    >

      {page==="overview" && (

        <Overview
          result={crai.result}
          readings={crai.readings}
          history={crai.history}
          onObserve={()=>setPage("observe")}
          onIntel={(item)=>{
            if(item){
              crai.selectResult(item);
            }

            setPage("intelligence");
          }}
          onZone={selectZone}
          onRefresh={crai.refreshAll}
        />

      )}

      {page==="observe" && (

        <Observe
          form={form}
          setForm={setForm}

          file={file}
          setFile={setFile}

          preview={preview}

          quality={crai.quality}

          adaptive={
            crai.adaptive ||
            crai.result?.adaptive
          }

          running={crai.running}

          error={crai.error}

          runAnalysis={runAnalysis}

          acquireSensor={async()=>{

            try{

              const completed =
                await crai.acquireSensor(
                  form.zoneId,
                  async()=>{

                    if(file){

                      return crai.analyze(
                        form,
                        file
                      );

                    }

                    return null;

                  }
                );

                if(
                  completed?.risk ||
                  completed?.analysis?.risk ||
                  crai.result?.risk
                ){

                  setPage("intelligence");

                }

            }catch(error){

              console.error(
                "Sensor acquisition failed:",
                error
              );

            }

          }}

          acquisitionState={
            crai.acquisitionState
          }

          onIntel={()=>
            setPage("intelligence")
          }

        />

      )}

      {page==="intelligence" && (

        <Intelligence
          result={crai.result}
          language={form.advisoryLanguage}
          onLanguageChange={
            changeAdvisoryLanguage
          }
          regenerateAdvisory={()=>
            regenerateAdvisory(form)
          }
          advisoryPlaying={
            advisoryPlaying
          }
          advisoryError={
            advisoryError
          }
          playAdvisory={
            playAdvisory
          }
          stopAdvisory={
            stopAdvisory
          }
          onObserve={()=>
            setPage("observe")
          }
        />

      )}

      {page==="sensors" && (

        <Sensors
          zoneId={form.zoneId}
          readings={crai.readings}
          online={crai.sensorOnline}
          backend={crai.backend}
          acquire={()=>
            crai.acquireSensor(
              form.zoneId
            )
          }
          simulate={async()=>{

            try{

              await crai.simulateSensor(
                form.zoneId
              );

            }catch{}

          }}
          state={
            crai.acquisitionState
          }
          error={crai.error}
        />

      )}

      {page==="history" && (

        <History
          history={crai.history}
          onObserve={()=>
            setPage("observe")
          }
          onSelect={item=>{

            crai.selectResult(item);
            setPage("intelligence");

          }}
        />

      )}

      {page==="reports" && (

        <Reports
          result={crai.result}
          history={crai.history}
          readings={crai.readings}
        />

      )}

      {page==="settings" && (

        <Settings
          settings={settings}
          setSettings={s=>{

            setSettings(s);

            setForm(f=>({
              ...f,
              advisoryLanguage:s.language
            }));

          }}
        />

      )}

    </Shell>

  );
}