import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormData = z.infer<typeof schema>;

export const Notes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, fetchNotes, addNote, updateNote, isLoading, error } = useStore();
  const [currentNote, setCurrentNote] = useState<NoteFormData | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (id && notes.length > 0) {
      const note = notes.find(n => n._id === id);
      if (note) {
        setCurrentNote({ title: note.title, content: note.content });
        reset({ title: note.title, content: note.content });
      }
    }
  }, [id, notes, reset]);

  const onSubmit = async (data: NoteFormData) => {
    if (id) {
      await updateNote(id, data.title, data.content);
    } else {
      await addNote(data.title, data.content);
    }
    navigate('/notes');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Note' : 'Create New Note'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            {...register('title')}
            className="w-full px-3 py-2 border rounded"
            defaultValue={currentNote?.title}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <textarea
            placeholder="Content"
            {...register('content')}
            className="w-full px-3 py-2 border rounded"
            rows={4}
            defaultValue={currentNote?.content}
          ></textarea>
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {id ? 'Update Note' : 'Add Note'}
        </button>
      </form>
    </div>
  );
};

