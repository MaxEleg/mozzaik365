import { usePostMeme } from "../../domains/meme/hooks";
import { MemeFormType } from "./types";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";

export const useHandleFormSubmit = () => {
  const { mutateAsync } = usePostMeme();
  const toast = useToast();
  const navigate = useNavigate();

  return async (values: MemeFormType) => {
    if (!values.picture?.file) {
      toast({
        title: "Please select a picture",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    await mutateAsync({
      picture: values.picture?.file,
      description: values.description || "",
      texts: values.texts?.map((text) => ({
        ...text,
        content: text.content || "",
      })),
    });

    toast({
      title: "Meme added successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    navigate({ to: "/" });
  };
};
