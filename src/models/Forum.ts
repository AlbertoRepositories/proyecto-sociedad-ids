import { Blog, BlogProperties, } from "./Blog";
import { Comment } from "./Comment";

export interface ForumProperties extends BlogProperties {
  comments?: Comment[];
  lastActivityDate?: Date | null;
}

/**
 * Represents a forum publication.
 *
 * - LSP: Forum can be used wherever a Blog is expected.
 * - SRP: manages forum comments and forum activity only.
 *
 * - Extract Subclass: forum-specific behavior was separated from
 *   the common Blog publication behavior.
 */
export class Forum extends Blog {
  public comments: Comment[];
  public lastActivityDate: Date | null;

  constructor(properties: ForumProperties) {
    super(properties);

    this.comments = [...(properties.comments ?? [])];
    this.lastActivityDate =
      properties.lastActivityDate ?? null;
  }

  public displayComments(): Comment[] {
    return this.comments.filter(
      (comment) =>
        !comment.isHiddenByAuthor &&
        !comment.isDeleted
    );
  }

  public addComment(comment: Comment): boolean {
    if (comment.content.trim().length === 0) {
      return false;
    }

    this.comments.push(comment);
    this.lastActivityDate = new Date();
    return true;
  }

  public removeExpiredComments(
    currentDate: Date
  ): number {
    if (
      this.expirationDate === null ||
      currentDate < this.expirationDate
    ) {
      return 0;
    }

    const removedComments = this.comments.length;
    this.comments = [];
    return removedComments;
  }
}