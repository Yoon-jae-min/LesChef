import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} LesChef</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/privacy" className="hover:text-gray-900">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
}
