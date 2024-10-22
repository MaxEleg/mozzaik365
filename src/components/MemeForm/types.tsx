export type MemeFormType = {
  picture: {
    file?: File;
    url?: string;
  };
  description?: string;
  texts: Array<{
    content?: string;
    x: number;
    y: number;
  }>;
};
