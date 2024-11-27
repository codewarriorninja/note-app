import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '../store/useStore';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof schema>;

export const Profile: React.FC = () => {
  const { user, updateProfile, error } = useStore();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data.username, data.password || '');
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            {...register('username')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">New Password (optional)</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Update Profile</button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

