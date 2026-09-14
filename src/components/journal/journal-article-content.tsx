import Image from "next/image";
import type { Locale } from "@/config/site";
import { JournalVideo } from "@/components/journal/journal-video";
import type {
  JournalArticle,
  JournalBodyBlock,
  JournalRichText,
} from "@/types/content";

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
  blocks = article.content[locale].body,
}: {
  article: JournalArticle;
  locale: Locale;
  blocks?: ReadonlyArray<JournalBodyBlock>;
}) {
  return (
    <div className="journal-prose">
      {blocks.map((block, index) => {
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

        if (block.type === "table") {
          return (
            <div key={`table-${index}`} className="journal-table">
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header, column) => (
                      <th key={column} scope="col">
                        <RichText content={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, column) => (
                        <td key={column}>
                          <RichText content={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
