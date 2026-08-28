export const getCount = (value: Array<{ count: number }> | undefined): number => {
  return value?.[0]?.count ?? 0;
};

export const convertGroupsToObject = (
  groups: Array<{ _id: string; count: number }> | undefined,
): Record<string, number> => {
  return Object.fromEntries((groups ?? []).map((group) => [group._id, group.count]));
};
