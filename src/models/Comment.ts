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
  isDeleted?: boolean;
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
  public isDeleted: boolean;

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
    this.isDeleted = properties.isDeleted ?? false;
  }

    /**
   * Publishes the comment unless it was permanently deleted.
   */
  public publishComment(): boolean {
    if (
      this.isDeleted ||
      this.content.trim().length === 0
    ) {
      return false;
    }

    this.isHiddenByAuthor = false;
    return true;
  }

  /**
   * Hides the comment for moderation.
   */
  public hideComment(): boolean {
    if (this.isDeleted) {
      return false;
    }

    this.isHiddenByAuthor = true;
    return true;
  }

  /**
   * Returns the public representation of the comment.
   */
  public displayComment(): string {
    if (
      this.isHiddenByAuthor ||
      this.isDeleted
    ) {
      return "";
    }

    return this.content;
  }

  /**
   * Permanently deletes the comment from the domain perspective.
   */
  public deleteComment(): boolean {
    this.isHiddenByAuthor = false;
    this.isDeleted = true;
    return true;
  }

    /**
   * Adds a reply to the comment.
   */
  public addReply(reply: Comment): boolean {
    if (
      this.isDeleted ||
      reply.isDeleted ||
      reply.content.trim().length === 0
    ) {
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