---
type: "query"
date: "2026-09-15T21:13:13.029253+00:00"
question: "Make Journal videos play like portfolio videos and place the first video at the beginning while keeping remaining videos in place"
contributor: "graphify"
outcome: "useful"
source_nodes: ["JournalArticleContent()", "JournalVideo()", "VideoCard()", "getVideoEmbedUrl()"]
---

# Q: Make Journal videos play like portfolio videos and place the first video at the beginning while keeping remaining videos in place

## Answer

Expanded from original query via graph vocab: [journal, video, videos, portfolio, article, content, media, embed]. The graph connected JournalArticleContent and JournalVideo with VideoCard and getVideoEmbedUrl. Source inspection confirmed Portfolio VideoCard activates an iframe with autoplay=1 after one click, while JournalVideo honored imported autoplay=false and generated autoplay=0. The renderer can lift the first referenced video into a leading block and remove only that index from its original block, preserving all other videos at their current positions.

## Outcome

- Signal: useful

## Source Nodes

- JournalArticleContent()
- JournalVideo()
- VideoCard()
- getVideoEmbedUrl()