import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Flex, Input } from "@chakra-ui/react";
import { User } from "../../domains/user/types";
import { AddCommentFormType } from "./types";
import { addCommentFormSchema } from "./validation";
import { Meme } from "../../domains/meme/types";
import { usePostComment } from "../../domains/meme/comment/hooks";

interface Props {
  user?: User;
  meme?: Meme;
}

export const AddCommentForm = ({ user, meme }: Props) => {
  const { register, handleSubmit, reset } = useForm<AddCommentFormType>({
    resolver: yupResolver(addCommentFormSchema),
  });
  const { mutateAsync } = usePostComment();

  const onSubmit = handleSubmit(async (values) => {
    const content = values.content;
    const memeId = meme?.id;

    if (!memeId || !content) {
      return;
    }

    await mutateAsync({ memeId, content });

    // after the comment is submitted we need to clean the input
    reset({ content: "" });
  });

  return (
    <form onSubmit={onSubmit}>
      <Flex alignItems="center">
        <Avatar
          borderWidth="1px"
          borderColor="gray.300"
          name={user?.username}
          src={user?.pictureUrl}
          size="sm"
          mr={2}
        />
        <Input
          {...register("content")}
          placeholder="Type your comment here..."
        />
      </Flex>
    </form>
  );
};
