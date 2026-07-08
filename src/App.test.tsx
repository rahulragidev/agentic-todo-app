import { mockIPC } from "@tauri-apps/api/mocks";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("greets by calling the Tauri greet command", async () => {
    mockIPC((cmd, args) => {
      if (cmd !== "greet") {
        return undefined;
      }
      return `Hello, ${(args as { name: string }).name}!`;
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Enter a name..."), {
      target: { value: "Rahul" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Greet" }));

    expect(await screen.findByText("Hello, Rahul!")).toBeInTheDocument();
  });
});
