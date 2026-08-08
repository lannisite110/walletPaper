import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "@/lib/content/loadPosts";

describe("loadPosts", () => {
  it("loads the public install guide from markdown frontmatter", () => {
    const post = getPostBySlug("install-vscode-theme");

    expect(post).toMatchObject({
      slug: "install-vscode-theme",
      title: "Install a VS Code theme from Wallet Paper",
      draft: false,
    });
    expect(post?.tags).toEqual(["vscode", "install"]);
    expect(post?.content).toContain("Open the theme page");
  });

  it("returns only non-draft posts", () => {
    expect(getAllPosts().every((post) => !post.draft)).toBe(true);
  });
});
