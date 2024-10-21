export type User = {
  id: string;
  username: string;
  pictureUrl: string;
};

export type GetUserByIdResponse = User;
export type GetUsersByIdsResponse = ReadonlyArray<User>;
