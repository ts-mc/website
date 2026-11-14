export interface YoutubeMetadataSnapshot {
  videoId: string;
  title?: string;
  description?: string;
  viewCount?: number;
  publishedAt?: string;
  fetchedAt?: string;
}

export interface YoutubeChannelVideoSnapshot {
  videoId: string;
  channel: string;
  title: string;
  publishedAt: string;
  viewCount?: number;
}

/** A public YouTube comment that a staff member has explicitly approved. */
export interface ApprovedYoutubeComment {
  videoId: string;
  commentId: string;
  author: string;
  text: string;
  publishedAt?: string;
  likeCount?: number;
  approvedAt: string;
}
