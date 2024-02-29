import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface Props {
  onNoteCreated: (content: string) => void
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition 
const speechRecognition = new SpeechRecognitionAPI()

const NewNoteCard = ({onNoteCreated} : Props) => {
  const [shouldShowOnboarding, setShouldShowOnBoarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleChangeTextarea(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  }
  
  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    if(content === ""){
      return
    }
    onNoteCreated(content)
    setContent("")
    setShouldShowOnBoarding(true)
    toast.success("Nota enviada com sucesso");
  }
  

  function handleStartRecording(){ 
    
    const isSpeechRecognitionAPIAvalable = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    
    if(!isSpeechRecognitionAPIAvalable){
      alert("Infelimente seu navgador não suporta a API de gravação!")
      return
    }

    setIsRecording(true)
    setShouldShowOnBoarding(false)


    speechRecognition.lang = "pt-BR"
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => { 
        return text.concat(result[0].transcript)
      }, "")
      setContent(transcription)
    }
    speechRecognition.start()    
   }

   function handleStopRecording() {
    setIsRecording(false);

    speechRecognition.stop();
}



  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-700 p-5 space-y-3 overflow-hidden relative hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200 ">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="overflow-hidden fixed -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col ">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            <form className="flex-1 flex flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {shouldShowOnboarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    comece gravndo uma{" "}
                    <button type="button" onClick={handleStartRecording} className="text-lime-400 font-medium hover:underline">
                      nota em aúdio
                    </button>{" "}
                    ou se prefrerir utilize{" "}
                    <button type="button"
                      onClick={handleStartEditor}
                      className="text-lime-400 font-medium hover:underline"
                    >
                      apenas texto.
                    </button>
                  </p>
                ) : (
                  <textarea
                    onChange={handleChangeTextarea}
                    autoFocus
                    className="text-sm bg-transparent flex-1 outline-none text-slate-400 resize-none"
                    value={content}
                  />
                )}
              </div>
              {isRecording ? (<button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bottom-0 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-300 "
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                Gravando! (clique p/ imterroper)
              </button>) : (
              <button
              
              type="button"
              onClick={handleSaveNote}
              className="w-full bottom-0 bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500 "
              >
                Salvar nota{" "}
              </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewNoteCard;
