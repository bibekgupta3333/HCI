/**
 * PostCard: a made-up social media post (wireframes §4). Identical in every condition.
 *
 * CSS classes (styled in src/styles/global.css):
 *   .post-card            <article> wrapper, looks like a social post card
 *   .post-card__header    author row
 *   .post-card__author    display name
 *   .post-card__verified  "✔" badge after the display name (verified accounts only)
 *   .post-card__meta      "@handle · 6h" line
 *   .post-card__handle    @handle
 *   .post-card__time      posted-ago
 *   .post-card__text      post body
 *   .post-card__stats     likes / reposts row
 *   .post-card__stat      one stat (also .post-card__stat--likes / --reposts)
 */
import type { Author } from "../../shared/types";

export interface PostCardProps {
  author: Author;
  text: string;
  postedAgo: string;
  likes: number;
  reposts: number;
}

export default function PostCard({ author, text, postedAgo, likes, reposts }: PostCardProps) {
  return (
    <article className="post-card" aria-label={`Post by ${author.displayName}`}>
      <header className="post-card__header">
        <span className="post-card__author">{author.displayName}</span>
        {author.verified && (
          <span className="post-card__verified" role="img" aria-label="verified account" title="Verified account">
            ✔
          </span>
        )}
        <div className="post-card__meta">
          <span className="post-card__handle">{author.handle}</span>
          {" · "}
          <span className="post-card__time">{postedAgo}</span>
        </div>
      </header>
      <p className="post-card__text">{text}</p>
      <footer className="post-card__stats">
        <span className="post-card__stat post-card__stat--likes" aria-label={`${likes} likes`}>
          <span aria-hidden="true">♡ {likes}</span>
        </span>
        <span className="post-card__stat post-card__stat--reposts" aria-label={`${reposts} reposts`}>
          <span aria-hidden="true">↻ {reposts}</span>
        </span>
      </footer>
    </article>
  );
}
