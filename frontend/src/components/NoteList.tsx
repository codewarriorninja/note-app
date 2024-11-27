import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export const NotesList: React.FC = () => {
  const { notes, fetchNotes, deleteNote, isLoading, error } = useStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>
      {notes.length === 0 ? (
        <p>You don't have any notes yet. Create your first note!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note._id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
              <p className="mb-4 text-gray-600">{note.content.substring(0, 100)}...</p>
              <div className="flex justify-between items-center">
                <Link to={`/notes/${note._id}`} className="text-blue-500 hover:text-blue-700">
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Link to="/notes/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Note
        </Link>
      </div>
    </div>
  );
};

