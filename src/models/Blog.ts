import { ContentType } from "../types/enums";
/**
 * Data required to create a Blog entity.
 */
export interface BlogProperties {
  id: string;
  title: string;
  content: string;
  creationDate?: Date;
  expirationDate?: Date | null;
  isVisible?: boolean;
  viewCount?: number;
  likeCount?: number;
  publicationType: ContentType;
  eventStartDate?: Date;
  eventEndDate?: Date;
  location?: string | null;
  registrationUrl?: string | null;
  imageUrls?: string[];
}

/**
 * Base entity for blog posts, news, events, and forum posts.
 *
 * SOLID:
 * - SRP: manages publication state and publication behavior.
 * - OCP: specialized publication types can extend this class.
 *
 * Refactoring:
 * - Extract Superclass: common publication behavior is centralized
 *   so Forum does not duplicate Blog logic.
 */
export abstract class Blog {
  public id: string;
  public title: string;
  public content: string;
  public creationDate: Date;
  public expirationDate: Date | null;
  public isVisible: boolean;
  public viewCount: number;
  public likeCount: number;
  public publicationType: ContentType;
  public isDeleted: boolean;
  public eventStartDate: Date;
  public eventEndDate: Date;
  public location: string | null;
  public registrationUrl: string | null;
  public imageUrls: string[];

  protected constructor(properties: BlogProperties) {
    this.id = properties.id;
    this.title = properties.title;
    this.content = properties.content;
    this.creationDate =
      properties.creationDate ?? new Date();
    this.expirationDate =
      properties.expirationDate ?? null;
    this.isVisible = properties.isVisible ?? false;
    this.viewCount = properties.viewCount ?? 0;
    this.likeCount = properties.likeCount ?? 0;
    this.publicationType = properties.publicationType;
    this.eventStartDate =
      properties.eventStartDate ?? new Date();
    this.eventEndDate =
      properties.eventEndDate ?? new Date();
    this.location = properties.location ?? null;
    this.registrationUrl =
      properties.registrationUrl ?? null;
    this.isDeleted = false;
    this.imageUrls = [...(properties.imageUrls ?? [])];
  }

  /**
   * Updates the title and content of the publication.
   */
  public editPost(
    title: string,
    content: string
  ): boolean {
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();

    if (
      normalizedTitle.length === 0 ||
      normalizedContent.length === 0
    ) {
      return false;
    }

    this.title = normalizedTitle;
    this.content = normalizedContent;
    return true;
  }

  /**
 * Returns the public representation of the publication.
 * Hidden and permanently deleted publications are not public.
 */
public displayPost(): string {
  if (!this.isVisible || this.isDeleted) {
    return "";
  }

  return `${this.title}\n\n${this.content}`;
}

/**
 * Permanently deletes the publication from the domain perspective.
 * The repository will later persist the permanent deletion.
 */
public deletePost(): boolean {
  this.isVisible = false;
  this.isDeleted = true;
  return true;
}

/**
 * Hides the publication for moderation.
 * Administrators may review hidden publications later.
 */
public hidePost(): boolean {
  if (this.isDeleted) {
    return false;
  }

  this.isVisible = false;
  return true;
}

/**
 * Publishes the publication unless it was permanently deleted.
 */
public publishPost(): boolean {
  if (
    this.isDeleted ||
    this.title.trim().length === 0 ||
    this.content.trim().length === 0
  ) {
    return false;
  }

  this.isVisible = true;
  return true;
}

  /**
   * Registers a publication view.
   */
  public registerView(): void {
    this.viewCount += 1;
  }

  /**
   * Registers a publication like.
   */
  public registerLike(): void {
    this.likeCount += 1;
  }
}
