import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SubpageShell } from "../../components/SubpageShell";
import { guideArticleMap, guideArticles } from "../../../lib/guide-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rhinory.shop";

export function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = guideArticleMap[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: [article.title, "전원주택", "단독주택", "마당", "설치비", "RHINORY"],
    alternates: { canonical: `/guide/${article.slug}` },
    openGraph: { type: "article", title: `${article.title} | RHINORY`, description: article.description, url: `/guide/${article.slug}`, images: [{ url: article.image, alt: article.title }] },
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = guideArticleMap[slug];
  if (!article) notFound();

  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "RHINORY", item: siteUrl }, { "@type": "ListItem", position: 2, name: "전원주택 외부공간 가이드", item: `${siteUrl}/guide` }, { "@type": "ListItem", position: 3, name: article.title, item: `${siteUrl}/guide/${article.slug}` }] };
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", "@id": `${siteUrl}/guide/${article.slug}#article`, headline: article.title, description: article.description, image: `${siteUrl}${article.image}`, datePublished: article.updatedAt, dateModified: article.updatedAt, inLanguage: "ko-KR", author: { "@type": "Organization", name: "RHINORY", url: siteUrl }, publisher: { "@type": "Organization", name: "RHINORY", url: siteUrl } };

  return (
    <SubpageShell title={article.title} kicker={`GUIDE / ${article.tag}`}>
      <article className="guide-detail-page page-frame">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <div className="guide-detail-hero">
          <img src={article.image} alt={`${article.title} 대표 이미지`} />
          <div>
            <p className="eyebrow light-eyebrow">{article.tag}</p>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </div>
        </div>
        <div className="guide-detail-body">
          <p className="eyebrow">RHINORY FIELD ANSWER</p>
          <h2>먼저 확인할 답</h2>
          <p className="guide-answer">{article.answer}</p>
          {article.sections.map((section) => (
            <section className="guide-article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </section>
          ))}
          <div className="guide-related-links">
            <Link href={`/category/${article.categorySlug}`} className="outline-button">관련 상품 보기 →</Link>
            <Link href="/consult" className="dark-button">우리 집 조건 상담하기 →</Link>
          </div>
        </div>
      </article>
    </SubpageShell>
  );
}
