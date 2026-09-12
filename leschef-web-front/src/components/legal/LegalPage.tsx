import Link from "next/link";
import AuthCitrusShell from "@/components/common/ui/AuthCitrusShell";
import SiteFooter from "@/components/common/ui/SiteFooter";

interface LegalSection {
  title: string;
  body: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <AuthCitrusShell>
      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-green-700/70">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-gray-500">시행일: {updatedAt}</p>
        <p className="mt-6 text-base leading-relaxed text-gray-600">{intro}</p>

        <div className="mt-10 space-y-8 rounded-[28px] border border-white/80 bg-white/95 px-6 py-8 shadow-sm backdrop-blur-sm sm:px-10 sm:py-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600 lg:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          <Link
            href="/"
            className="font-medium text-green-600 underline-offset-4 hover:underline"
          >
            홈으로
          </Link>
        </p>
      </main>
      <SiteFooter />
    </AuthCitrusShell>
  );
}
