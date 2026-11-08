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

  public publishComment(): boolean {
    if (
      this.content.trim().length === 0
    ) {
      return false;
    }

    this.isHiddenByAuthor = false;
    return true;
  }

  public hideComment(): boolean {
    if (this.isHiddenByAuthor) {
      return false;
    }

    this.isHiddenByAuthor = true;
    return true;
  }

  public displayComment(): string {
    if (
      this.isHiddenByAuthor
    ) {
      return "";
    }

    return this.content;
  }

  public deleteComment(): boolean {
    this.isHiddenByAuthor = false;
    return true;
  }

  public addReply(reply: Comment): boolean {
    if (
      this.isHiddenByAuthor ||
      reply.isHiddenByAuthor ||
      reply.content.trim().length === 0
    ) {
      return false;
    }

    this.replies.push(reply);
    return true;
  }

  public registerLike(): void {
    this.likeCount += 1;
  }
}