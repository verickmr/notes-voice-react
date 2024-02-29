import { ChangeEvent, useState } from "react";
import NewNoteCard from "./Components/NewNoteCard";
import NoteCard from "./Components/NoteCard";

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState("")
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesStorage = localStorage.getItem("notes")

    if(notesStorage){
      return JSON.parse(notesStorage)
    }

    return []
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem("notes", JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string){
    const notesArray = notes.filter(note=>{
      return note.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem("notes", JSON.stringify(notesArray))

  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }


  const filterNotes = search !== "" ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <form className="w-full" action="">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent tracking-tight font-semibold outline-none text-3xl placeholder: text-slate-500"
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-cols-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filterNotes.map((note) => {
          return <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
