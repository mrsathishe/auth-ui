import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchParamsWrapper from "../SearchParamsWrapper";

// Mock useSearchParams
const mockUseSearchParams = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock URLSearchParams
const mockSearchParams = {
  get: jest.fn(),
  set: jest.fn(),
  has: jest.fn(),
  delete: jest.fn(),
  toString: jest.fn(),
};

describe("SearchParamsWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(mockSearchParams);
  });

  it("renders children with search params", () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "callback") return "http://localhost:3001/auth/callback";
      if (key === "force") return "true";
      return null;
    });

    const mockChildren = jest.fn((params) => {
      expect(params).toBe(mockSearchParams);
      return <div data-testid="child-component">Child rendered</div>;
    });

    render(<SearchParamsWrapper>{mockChildren}</SearchParamsWrapper>);

    expect(screen.getByTestId("child-component")).toBeInTheDocument();
    expect(mockChildren).toHaveBeenCalledWith(mockSearchParams);
  });

  it("shows loading fallback during suspense", () => {
    // Mock useSearchParams to throw (simulating suspense)
    mockUseSearchParams.mockImplementation(() => {
      throw new Promise(() => {}); // Never resolves to simulate loading
    });

    render(
      <SearchParamsWrapper>
        {() => <div>Should not render</div>}
      </SearchParamsWrapper>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("passes different search params correctly", () => {
    const testCases = [
      { callback: "http://example.com", force: null },
      { callback: null, force: "true" },
      { callback: "http://test.com", force: "false" },
    ];

    testCases.forEach(({ callback, force }) => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === "callback") return callback;
        if (key === "force") return force;
        return null;
      });

      const mockChildren = jest.fn(() => <div>Test</div>);

      const { unmount } = render(
        <SearchParamsWrapper>{mockChildren}</SearchParamsWrapper>
      );

      expect(mockChildren).toHaveBeenCalledWith(mockSearchParams);

      unmount();
      jest.clearAllMocks();
    });
  });

  it("handles children function that returns null", () => {
    const mockChildren = jest.fn(() => null);

    const { container } = render(
      <SearchParamsWrapper>{mockChildren}</SearchParamsWrapper>
    );

    expect(mockChildren).toHaveBeenCalledWith(mockSearchParams);
    expect(container.firstChild).toBeNull();
  });

  it("handles children function that returns multiple elements", () => {
    const mockChildren = jest.fn(() => (
      <>
        <div data-testid="first">First</div>
        <div data-testid="second">Second</div>
      </>
    ));

    render(<SearchParamsWrapper>{mockChildren}</SearchParamsWrapper>);

    expect(screen.getByTestId("first")).toBeInTheDocument();
    expect(screen.getByTestId("second")).toBeInTheDocument();
  });
});
