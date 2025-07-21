import { redirect } from "next/navigation";

// Mock Next.js redirect function
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the redirect to throw an error to simulate Next.js behavior
    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
  });

  it("redirects to register page", () => {
    expect(() => {
      require("../page");
    }).toThrow("NEXT_REDIRECT");

    expect(mockRedirect).toHaveBeenCalledWith("/register");
  });
});
