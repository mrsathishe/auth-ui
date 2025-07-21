import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface SearchParamsWrapperProps {
  children: (params: URLSearchParams) => React.ReactNode;
}

function SearchParamsComponent({ children }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default function SearchParamsWrapper({
  children,
}: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent>{children}</SearchParamsComponent>
    </Suspense>
  );
}
