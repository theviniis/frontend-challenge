import { queryOptions } from '@tanstack/react-query';
import { http } from '@/lib/http/client';
import { endpoints } from '@/lib/http/endpoints';
import { profileSchema } from '@/lib/http/schemas';
import { keyFactory } from '@/lib/query/keys';
export const profileOptions = (userId: string) =>
  queryOptions({
    queryKey: keyFactory.profile(userId),
    queryFn: async ({ signal }) =>
      profileSchema.parse((await http.get(endpoints.profile, { signal })).data),
  });
export async function updateProfile(input: import('@/types/api').ProfilePatch) {
  const { profilePatchSchema } = await import('@/lib/http/schemas');
  return profileSchema.parse(
    (await http.patch(endpoints.profile, profilePatchSchema.parse(input))).data
  );
}
