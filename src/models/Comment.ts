import { User } from "./User";

/**
 * Data required to create a Comment entity.
 */
export interface CommentProperties {
  id: string;
  content: string;
  author: User;
  creationDate?: Date;
  likeCount?: number;
  isHiddenByAuthor?: boolean;
  replies?: Comment[];
}

/**
 * Represents a forum comment and its replies.
 *
 * SOLID:
 * - SRP: manages comment state and comment-specific behavior.
 *
 * Refactoring:
 * - Encapsulate Field: comment state is changed through methods
 *   instead of unrestricted external operations.
 */
export class Comment {
  public id: string;
  public content: string;
  public creationDate: Date;
  public likeCount: number;
  public isHiddenByAuthor: boolean;
  public author: User;
  public replies: Comment[];

  constructor(properties: CommentProperties) {
    this.id = properties.id;
    this.content = properties.content;
    this.creationDate =
      properties.creationDate ?? new Date();
    this.likeCount = properties.likeCount ?? 0;
    this.isHiddenByAuthor =
      properties.isHiddenByAuthor ?? false;
    this.author = properties.author;
    this.replies = [...(properties.replies ?? [])];
  }

  /**
   * Publishes the comment when it contains text.
   */
  public publishComment(): boolean {
    if (this.content.trim().length === 0) {
      return false;
    }

    this.isHiddenByAuthor = false;
    return true;
  }

  /**
   * Hides the comment without removing its record.
   */
  public hideComment(): boolean {
    this.isHiddenByAuthor = true;
    return true;
  }

  /**
   * Returns an empty string when the comment is hidden.
   */
  public displayComment(): string {
    return this.isHiddenByAuthor
      ? ""
      : this.content;
  }

  /**
   * Uses the same soft-delete behavior as hiding a comment.
   */
  public deleteComment(): boolean {
    this.isHiddenByAuthor = true;
    return true;
  }

  /**
   * Adds a reply to the comment.
   */
  public addReply(reply: Comment): boolean {
    if (reply.content.trim().length === 0) {
      return false;
    }

    this.replies.push(reply);
    return true;
  }

  /**
   * Registers a like on the comment.
   */
  public registerLike(): void {
    this.likeCount += 1;
  }
}