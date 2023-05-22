import React, { DOMAttributes, ReactNode } from "react";

interface Props {
  onClick: DOMAttributes<HTMLButtonElement>["onClick"];
  children: ReactNode;
  testId: string;
}

export default function Button({ onClick, children, testId }: Props) {
  return (
    <button
      type="button"
      className="border-solid rounded border-2 border-primary px-2 hover:bg-primary hover:text-white"
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
