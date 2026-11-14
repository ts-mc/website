import approvedComments from "@/data/youtube-helpful-comments.json";
import type { ApprovedYoutubeComment } from "@/types/youtube";

const comments = approvedComments as ApprovedYoutubeComment[];

/**
 * Public pages deliberately read only staff-approved comments. Candidates from
 * the importer are never shipped to visitors, even if they sound positive.
 */
export function getApprovedYoutubeComments(videoId?: string): ApprovedYoutubeComment[] {
  if (!videoId) return [];
  return comments.filter((comment) => comment.videoId === videoId);
}
