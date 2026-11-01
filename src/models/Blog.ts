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
  publicationType: string;
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
  public publicationType: string;
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
    this.imageUrls = [...(properties.imageUrls ?? [])];
  }

  /**
   * Makes the publication visible.
   */
  public publishPost(): boolean {
    if (
      this.title.trim().length === 0 ||
      this.content.trim().length === 0
    ) {
      return false;
    }

    this.isVisible = true;
    return true;
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
   */
  public displayPost(): string {
    if (!this.isVisible) {
      return "";
    }

    return `${this.title}\n\n${this.content}`;
  }

  /**
   * Hides the publication.
   *
   * The persistence layer is responsible for physically deleting records.
   */
  public deletePost(): boolean {
    this.isVisible = false;
    return true;
  }

  /**
   * Hides the publication without deleting its record.
   */
  public hidePost(): boolean {
    this.isVisible = false;
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
