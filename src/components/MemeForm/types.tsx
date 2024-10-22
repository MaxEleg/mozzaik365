export type MemeFormType = {
  picture?: {
    file: File;
    url: string;
  };
  description?: string;
  texts: ReadonlyArray<{
    content: string;
    x: number;
    y: number;
  }>;
};
