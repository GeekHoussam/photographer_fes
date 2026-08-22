import Image from "next/image";
import type { Locale } from "@/config/site";
import { JournalVideo } from "@/components/journal/journal-video";
import type { JournalArticle, JournalRichText } from "@/types/content";

export function RichText({ content }: { content: JournalRichText }) {
  return content.map((segment, index) => {
    if (typeof segment === "string") return segment;
    if (segment.emphasis === "strong") {
      return <strong key={`${segment.text}-${index}`}>{segment.text}</strong>;
    }
    return <em key={`${segment.text}-${index}`}>{segment.text}</em>;
  });
}

export function JournalArticleContent({
  article,
  locale,
}: {
  article: JournalArticle;
  locale: Locale;
}) {
  const content = article.content[locale];

  return (
    <div className="journal-prose">
      {content.body.map((block, index) => {
        if (block.type === "heading") {
          return block.level === 2 ? (
            <h2 key={`${block.text}-${index}`}>{block.text}</h2>
          ) : (
            <h3 key={`${block.text}-${index}`}>{block.text}</h3>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={`paragraph-${index}`}>
              <RichText content={block.content} />
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`list-${index}-${itemIndex}`}>
                  <RichText content={item} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "image") {
          const image = article.images[block.imageIndex];
          return (
            <figure
              key={`image-${block.imageIndex}`}
              className="journal-inline-media media-frame"
              data-journal-image
              data-image-orientation={
                image.height > image.width ? "portrait" : "landscape"
              }
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="h-auto w-full"
              />
            </figure>
          );
        }

        return (
          <div
            key={`videos-${index}`}
            className={`journal-video-grid ${
              block.videoIndexes.length > 1 ? "journal-video-grid-multiple" : ""
            }`}
          >
            {block.videoIndexes.map((videoIndex) => {
              const video = article.videos[videoIndex];
              return video ? (
                <JournalVideo
                  key={video.videoId}
                  video={video}
                  locale={locale}
                />
              ) : null;
            })}
          </div>
        );
      })}
    </div>
  );
}
