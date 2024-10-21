import { http, HttpResponse } from "msw";
import { AddCommentForm } from "..";
import { server } from "../../../../tests/setup";
import { renderWithProvider } from "../../../__tests__/utils";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("AddCommentForm", () => {
  it("should submit the form and trim the content", async () => {
    const { type } = userEvent.setup();
    const postFn = vi.fn();

    server.use(
      http.post(
        `https://fetestapi.int.mozzaik365.net/api/memes/meme-id/comments`,
        async ({ request }) => {
          postFn(await request.json());
          return HttpResponse.json({});
        }
      )
    );

    renderWithProvider(
      <AddCommentForm
        user={{
          id: "user-id",
          username: "TestUser",
          pictureUrl: "imageURL",
        }}
        meme={{
          id: "meme-id",
          authorId: "1",
          pictureUrl: "imageURL",
          description: "My awesome meme",
          commentsCount: 3,
          texts: [
            {
              content: "Fake",
              x: 0,
              y: 2,
            },
          ],
          createdAt: new Date().toString(),
        }}
      />
    );

    expect(await screen.findByRole("textbox")).toBeInTheDocument();

    await type(
      screen.getByRole("textbox"),
      "    value without trim {enter}       "
    );

    await waitFor(() =>
      expect(postFn).toHaveBeenNthCalledWith(1, {
        content: "value without trim",
      })
    );
  });
});
