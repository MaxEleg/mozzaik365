import { Flex, StackDivider, VStack } from "@chakra-ui/react";
import { Loader } from "../../components/Loader";
import { useState } from "react";
import { useGetMemesOnScrollEnd } from "./hooks";
import { MemeItem } from "./MemeItem";
import { useGetMemesAuthorsIds } from "../../domains/meme/author/hooks";
import { useGetUser, useGetUsers } from "../../domains/user/hooks";

export const MemeFeedPage: React.FC = () => {
  const { ref, data: memes, isLoading, hasNextPage } = useGetMemesOnScrollEnd();
  const user = useGetUser();
  const [openedCommentSectionId, setOpenedCommentSection] = useState<
    string | null
  >(null);
  const memesAuthorsIds = useGetMemesAuthorsIds();
  const { data: users } = useGetUsers(memesAuthorsIds, {
    enabled: !!memesAuthorsIds.length,
  });

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }

  return (
    <>
      <Flex width="full" height="full" justifyContent="center" overflowY="auto">
        <VStack
          p={4}
          width="full"
          maxWidth={800}
          divider={<StackDivider border="gray.200" />}
        >
          {memes.map((meme) => (
            <MemeItem
              key={meme.id}
              meme={meme}
              user={user}
              isOpened={meme.id === openedCommentSectionId}
              setOpenedCommentSection={setOpenedCommentSection}
              author={users?.find((user) => user.id === meme.authorId)}
            />
          ))}
          {hasNextPage && (
            <Loader ref={ref} data-testid="load-more-memes-loader" />
          )}
        </VStack>
      </Flex>
    </>
  );
};
