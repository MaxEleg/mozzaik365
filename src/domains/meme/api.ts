import { memeApi } from "../../libs/axios";
import { GetMemesResponse, Meme } from "./types";

export const getMemes = async (pageNumber: number) => {
  const { data } = await memeApi.get<GetMemesResponse>(
    `/memes?Page=${pageNumber}`
  );

  return data;
};

type PostMemeParams = {
  picture: File;
  description?: string;
  texts: ReadonlyArray<{
    x: number;
    y: number;
    content: string;
  }>;
};
export const postMeme = async (newMeme: PostMemeParams) => {
  const formData = new FormData();

  formData.append("Picture", newMeme.picture);
  formData.append("Description", newMeme.description || "");

  newMeme.texts.forEach((text, index) => {
    formData.append(`Texts[${index}][x]`, Math.round(text.x).toString());
    formData.append(`Texts[${index}][y]`, Math.round(text.y).toString());
    formData.append(`Texts[${index}][content]`, text.content);
  });

  const { data } = await memeApi.post<Meme>("/memes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
