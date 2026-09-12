import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-8 text-center text-sm text-gray-500 sm:flex-row sm:justify-center sm:gap-6">
        <p>© LesChef</p>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/privacy"
            className="rounded-lg transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/terms"
            className="rounded-lg transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
}
