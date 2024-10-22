import userEvent from "@testing-library/user-event";
import { MemeForm } from "..";
import { renderWithRouter } from "../../../__tests__/utils";
import { screen, waitFor } from "@testing-library/react";
import { TestProviders } from "../../../__tests__/TestProviders";
import { server } from "../../../../tests/setup";
import { http, HttpResponse } from "msw";

beforeAll(() => {
  URL.createObjectURL = () => Math.random().toString();
});

describe("MemeForm", () => {
  it("should be able to customize the meme and submit it", async () => {
    const { click, type, upload, clear } = userEvent.setup();

    server.use(
      http.post("https://fetestapi.int.mozzaik365.net/api/memes", async () =>
        HttpResponse.json({})
      )
    );

    renderWithRouter({ component: MemeForm, Wrapper: TestProviders });

    expect(await screen.findByRole("presentation")).toBeInTheDocument();

    // while the user didnt select an image we ensure that theses buttons is disabled
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Add a caption" })
      ).toHaveAttribute("aria-disabled", "true")
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
        "aria-disabled",
        "true"
      )
    );

    expect(screen.getByRole("button", { name: "Add a caption" }));

    await type(
      screen.getByPlaceholderText("Type your description here..."),
      "my description"
    );

    // we get the dropzone element
    const dropzone = screen.getByTestId("picture-input");

    // fake file for drag n drop
    const file = new File(["file content"], "meme-bg.png", {
      type: "image/png",
    });

    // we simulate a drop event
    await upload(dropzone, [file]);

    // now that we selected a file theses button shouldn't be disabled anymore
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Add a caption" })
      ).toHaveAttribute("aria-disabled", "false")
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
        "aria-disabled",
        "false"
      )
    );

    await click(screen.getByRole("button", { name: "Add a caption" }));
    await click(screen.getByRole("button", { name: "Add a caption" }));

    // we are waiting that the 2 inputs are visible on the DOM
    expect(
      await screen.findByRole("textbox", { name: "text 1" })
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("textbox", { name: "text 2" })
    ).toBeInTheDocument();

    // when they are we check the caption texts default values
    await waitFor(() =>
      expect(screen.getByTestId("-text-0")).toHaveTextContent("New caption 1")
    );
    await waitFor(() =>
      expect(screen.getByTestId("-text-1")).toHaveTextContent("New caption 2")
    );

    // when we update the texts values
    await clear(screen.getByRole("textbox", { name: "text 1" }));
    await type(screen.getByRole("textbox", { name: "text 1" }), "my text 1");

    await clear(screen.getByRole("textbox", { name: "text 2" }));
    await type(screen.getByRole("textbox", { name: "text 2" }), "my text 2");

    // we ensure that the captions texts are updated aswell
    await waitFor(() =>
      expect(screen.getByTestId("-text-0")).toHaveTextContent("my text 1")
    );
    await waitFor(() =>
      expect(screen.getByTestId("-text-1")).toHaveTextContent("my text 2")
    );

    // we submit the form
    await click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Meme added successfully")
    ).toBeInTheDocument();

    // for this test not possible to check the payload because of this issue https://github.com/mswjs/msw/issues/2166
    // looks like msw cannot decode formData on vitest
  });
});
