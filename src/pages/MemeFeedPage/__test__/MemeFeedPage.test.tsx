import userEvent from "@testing-library/user-event";
import { renderWithProvider } from "../../../__tests__/utils";
import { MemeFeedPage } from "..";
import { server } from "../../../../tests/setup";
import { http, HttpResponse } from "msw";
import {
  memesResponseFixture,
  usersListResponseFixture,
  meme1commentsResponse,
} from "./fixtures";
import { PaginatedMemeApiResponse } from "../../../libs/axios";
import { Meme } from "../../../domains/meme/types";
import { screen, waitFor } from "@testing-library/react";
import { GetUsersByIdsResponse } from "../../../domains/user/types";
import { Comment } from "../../../domains/meme/comment/types";

beforeAll(() => {
  // Mock the scrollTo method globally
  window.scrollTo = () => {};
});

describe("MemeFeedPage", () => {
  it("display the memes info on the feed properly", async () => {
    server.use(
      http.get(
        "https://fetestapi.int.mozzaik365.net/api/users?ids=user-1&ids=user-2",
        async () =>
          HttpResponse.json<GetUsersByIdsResponse>(usersListResponseFixture)
      ),
      http.get(
        "https://fetestapi.int.mozzaik365.net/api/memes?Page=1",
        async () =>
          HttpResponse.json<PaginatedMemeApiResponse<Meme>>(
            memesResponseFixture
          )
      )
    );

    renderWithProvider(<MemeFeedPage />);

    await waitFor(() =>
      expect(screen.queryByTestId("meme-feed-loader")).not.toBeInTheDocument()
    );

    // we ensure that the memes names are displayed
    expect(await screen.findByText("Dummy meme 1")).toBeInTheDocument();
    expect(await screen.findByText("Dummy meme 2")).toBeInTheDocument();

    // we ensure that the memes textes are displayed
    expect(
      await screen.findByTestId("meme-picture-dummy-meme-id-1-text-0")
    ).toHaveTextContent("dummy text 1");
    expect(
      await screen.findByTestId("meme-picture-dummy-meme-id-1-text-1")
    ).toHaveTextContent("dummy text 2");
    expect(
      await screen.findByTestId("meme-picture-dummy-meme-id-2-text-0")
    ).toHaveTextContent("dummy text 3");
    expect(
      await screen.findByTestId("meme-picture-dummy-meme-id-2-text-1")
    ).toHaveTextContent("dummy text 4");

    // we ensure that the memes description are displayed
    expect(
      await screen.findByTestId("meme-description-dummy-meme-id-1")
    ).toHaveTextContent("Dummy meme 1");
    expect(
      await screen.findByTestId("meme-description-dummy-meme-id-2")
    ).toHaveTextContent("Dummy meme 2");

    // we ensure that the comment count is displayed well
    expect(
      await screen.findByTestId("meme-comments-count-dummy-meme-id-1")
    ).toHaveTextContent("2 comments");
    expect(
      await screen.findByTestId("meme-comments-count-dummy-meme-id-2")
    ).toHaveTextContent("3 comments");

    // we ensure that the dates are formatted well
    expect(
      await screen.findByTestId("meme-date-dummy-meme-id-1")
    ).toHaveTextContent("2 days ago");
    expect(
      await screen.findByTestId("meme-date-dummy-meme-id-2")
    ).toHaveTextContent("3 years ago");
  });

  it("add new comment and update the comments count", async () => {
    const { type, click } = userEvent.setup();
    const postFn = vi.fn();

    server.use(
      http.get(
        "https://fetestapi.int.mozzaik365.net/api/users?ids=fake-author-meme-1&ids=fake-author-meme-2",
        async () =>
          HttpResponse.json<GetUsersByIdsResponse>(usersListResponseFixture)
      ),
      http.get(
        "https://fetestapi.int.mozzaik365.net/api/memes?Page=1",
        async () =>
          HttpResponse.json<PaginatedMemeApiResponse<Meme>>(
            memesResponseFixture
          )
      ),
      http.get(
        "https://fetestapi.int.mozzaik365.net/api/memes/dummy-meme-id-1/comments?page=1",
        async () =>
          HttpResponse.json<PaginatedMemeApiResponse<Comment>>(
            meme1commentsResponse
          )
      ),
      http.post(
        "https://fetestapi.int.mozzaik365.net/api/memes/dummy-meme-id-1/comments",
        async ({ request }) => {
          postFn(await request.json());
          return HttpResponse.json<Comment>({
            id: "my-new-amazing-comment",
            authorId: "user-1",
            memeId: "dummy-meme-id-1",
            content: "my new amazing comment",
            createdAt: new Date().toString(),
          });
        }
      )
    );

    renderWithProvider(<MemeFeedPage />);

    await waitFor(() =>
      expect(screen.queryByTestId("meme-feed-loader")).not.toBeInTheDocument()
    );

    // we ensure that the comment count is displayed well
    expect(
      await screen.findByTestId("meme-comments-count-dummy-meme-id-1")
    ).toHaveTextContent("2 comments");
    expect(
      await screen.findByTestId("meme-comments-count-dummy-meme-id-2")
    ).toHaveTextContent("3 comments");

    await click(screen.getByText("2 comments"));

    await waitFor(() =>
      expect(screen.getByText("dummy comment 1")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("dummy comment 2")).toBeInTheDocument()
    );

    // we are submitting a new comment
    await type(
      screen.getByPlaceholderText("Type your comment here..."),
      "my new amazing comment{enter}"
    );

    await waitFor(() =>
      expect(postFn).toHaveBeenNthCalledWith(1, {
        content: "my new amazing comment",
      })
    );

    // we are checking if the comments count are updated
    expect(
      await screen.findByTestId("meme-comments-count-dummy-meme-id-1")
    ).toHaveTextContent("3 comments");
    expect(
      await screen.findByTestId("meme-comments-count-dummy-meme-id-2")
    ).toHaveTextContent("3 comments");

    // check the new date of our new comment
    await waitFor(() =>
      expect(
        screen.getByTestId(
          "meme-comment-date-dummy-meme-id-1-my-new-amazing-comment"
        )
      ).toHaveTextContent("just now")
    );
  });
});
