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

export function featureFirstJournalVideo(
  blocks: ReadonlyArray<JournalBodyBlock>,
): ReadonlyArray<JournalBodyBlock> {
  const sourceBlockIndex = blocks.findIndex(
    (block) => block.type === "videos" && block.videoIndexes.length > 0,
  );
  if (sourceBlockIndex === -1) return blocks;

  const sourceBlock = blocks[sourceBlockIndex];
  if (sourceBlock.type !== "videos") return blocks;

  const [featuredVideoIndex, ...remainingVideoIndexes] =
    sourceBlock.videoIndexes;
  if (featuredVideoIndex === undefined) return blocks;

  const remainingBlocks = blocks.flatMap((block, index) => {
    if (index !== sourceBlockIndex) return [block];
    if (remainingVideoIndexes.length === 0) return [];
    return [{ ...sourceBlock, videoIndexes: remainingVideoIndexes }];
  });

  return [
    { type: "videos", videoIndexes: [featuredVideoIndex] },
    ...remainingBlocks,
  ];
}

export function JournalArticleContent({
  article,
  locale,
  blocks = article.content[locale].body,
  featureFirstVideo = false,
}: {
  article: JournalArticle;
  locale: Locale;
  blocks?: ReadonlyArray<JournalBodyBlock>;
  featureFirstVideo?: boolean;
}) {
  const renderedBlocks = featureFirstVideo
    ? featureFirstJournalVideo(blocks)
    : blocks;

  return (
    <div className="journal-prose">
      {renderedBlocks.map((block, index) => {
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
            data-journal-featured-video={
              featureFirstVideo && index === 0 ? "true" : undefined
            }
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
