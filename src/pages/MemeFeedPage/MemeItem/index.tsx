import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { MemeView } from "../../../components/MemeView";
import { User } from "../../../domains/user/types";
import { Meme } from "../../../domains/meme/types";
import {
  useGetCommentsAuthorsIds,
  useGetInfiniteComments,
} from "../../../domains/meme/comment/hooks";
import { useRefetchOnScroll } from "../../../hooks";
import { AddCommentForm } from "../../../components/AddCommentForm";
import { formatDate } from "../../../utils";
import { useGetUsers } from "../../../domains/user/hooks";

type Props = {
  meme: Meme;
  user?: User;
  author?: User;
  isOpened: boolean;
  setOpenedCommentSection: (val: string | null) => void;
};

export const MemeItem = ({
  meme,
  user,
  author,
  isOpened,
  setOpenedCommentSection,
}: Props) => {
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteComments(meme.id, {
    enabled: isOpened,
  });
  const commentsAuthorsIds = useGetCommentsAuthorsIds(meme.id);
  // here we get all author ids from the comment
  const { data: commentsAuthors } = useGetUsers(commentsAuthorsIds, {
    enabled: isOpened && commentsAuthorsIds.length > 0,
  });
  const { ref } = useRefetchOnScroll(fetchNextPage);

  return (
    <VStack key={meme.id} p={4} width="full" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Avatar
            borderWidth="1px"
            borderColor="gray.300"
            size="xs"
            name={author?.username}
            src={author?.pictureUrl}
          />
          <Text ml={2} data-testid={`meme-author-${meme.id}`}>
            {author?.username}
          </Text>
        </Flex>
        <Text
          data-testid={`meme-date-${meme.id}`}
          fontStyle="italic"
          color="gray.500"
          fontSize="small"
        >
          {formatDate(meme.createdAt)}
        </Text>
      </Flex>
      <MemeView
        pictureUrl={meme.pictureUrl}
        texts={meme.texts}
        dataTestId={`meme-picture-${meme.id}`}
      />
      <Box>
        <Text fontWeight="bold" fontSize="medium" mb={2}>
          Description:{" "}
        </Text>
        <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
          <Text
            color="gray.500"
            whiteSpace="pre-line"
            data-testid={`meme-description-${meme.id}`}
          >
            {meme.description}
          </Text>
        </Box>
      </Box>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${meme.id}`}
              cursor="pointer"
              onClick={() => setOpenedCommentSection(isOpened ? null : meme.id)}
            >
              <Text data-testid={`meme-comments-count-${meme.id}`}>
                {meme.commentsCount} comments
              </Text>
            </LinkOverlay>
            <Icon as={!isOpened ? CaretDown : CaretUp} ml={2} mt={1} />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={isOpened} animateOpacity>
        <Box mb={6}>
          {isOpened && <AddCommentForm user={user} meme={meme} />}
        </Box>
        <VStack align="stretch" spacing={4}>
          {comments?.map((comment) => {
            const commentAuthor = commentsAuthors?.find(
              (author) => author.id === comment.authorId
            );
            return (
              <Flex key={comment.id}>
                <Avatar
                  borderWidth="1px"
                  borderColor="gray.300"
                  size="sm"
                  name={commentAuthor?.username}
                  src={commentAuthor?.pictureUrl}
                  mr={2}
                />
                <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex>
                      <Text
                        data-testid={`meme-comment-author-${meme.id}-${comment.id}`}
                      >
                        {commentAuthor?.username}
                      </Text>
                    </Flex>
                    <Text
                      data-testid={`meme-comment-date-${meme.id}-${comment.id}`}
                      fontStyle="italic"
                      color="gray.500"
                      fontSize="small"
                    >
                      {formatDate(comment.createdAt)}
                    </Text>
                  </Flex>
                  <Text
                    color="gray.500"
                    whiteSpace="pre-line"
                    data-testid={`meme-comment-content-${meme.id}-${comment.id}`}
                  >
                    {comment.content}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </VStack>
        {hasNextPage && <span ref={ref}>Loading...</span>}
      </Collapse>
    </VStack>
  );
};
