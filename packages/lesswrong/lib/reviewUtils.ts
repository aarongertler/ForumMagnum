import moment from "moment"
import { forumTypeSetting } from "./instanceSettings"
import { annualReviewEnd, annualReviewNominationPhaseEnd, annualReviewReviewPhaseEnd, annualReviewStart } from "./publicSettings"

const isEAForum = forumTypeSetting.get() === "EAForum"
const isLWForum = forumTypeSetting.get() === "LessWrong"

export type ReviewYear = 2018 | 2019 | 2020

/** Review year is the year under review, not the year in which the review takes place. */
export const REVIEW_YEAR: ReviewYear = 2020

// Probably only used while the EA Forum is doing something sufficiently different
export const REVIEW_NAME = isEAForum ? 'EA Writing Mega Review' : `${REVIEW_YEAR} Review`

export type ReviewPhase = "NOMINATIONS" | "REVIEWS" | "VOTING"

export function getReviewPhase(): ReviewPhase | void {
  const currentDate = moment()
  const reviewStart = moment(annualReviewStart.get())
  const nominationsPhaseEnd = moment(annualReviewNominationPhaseEnd.get())
  const reviewPhaseEnd = moment(annualReviewReviewPhaseEnd.get())
  const reviewEnd = moment(annualReviewEnd.get())
  
  if (currentDate < reviewStart || reviewEnd < currentDate) return
  if (currentDate < nominationsPhaseEnd) return "NOMINATIONS"
  if (currentDate < reviewPhaseEnd) return "REVIEWS"
  if (currentDate < reviewEnd) return "VOTING"
  return
}

/** Is there an active review taking place? */
export function reviewIsActive(): boolean {
  return !!getReviewPhase()
}

export function eligibleToNominate (currentUser: UsersCurrent|null) {
  if (!currentUser) return false;
  if (isLWForum && new Date(currentUser.createdAt) > new Date(`${REVIEW_YEAR}-01-01`)) return false
  if (isEAForum && new Date(currentUser.createdAt) > new Date(annualReviewStart.get())) return false
  return true
}

export function canNominate (currentUser: UsersCurrent|null, post: PostsBase) {
  if (!eligibleToNominate(currentUser)) return false
  if (post.userId === currentUser!._id) return false
  if (new Date(post.postedAt) > new Date(`${REVIEW_YEAR+1}-01-01`)) return false
  if (isLWForum && new Date(post.postedAt) < new Date(`${REVIEW_YEAR}-01-01`)) return false
  return true
}

export const currentUserCanVote = (currentUser: UsersCurrent|null) => {
  if (!currentUser) return false
  if (isLWForum && new Date(currentUser.createdAt) > new Date(`${REVIEW_YEAR}-01-01`)) return false
  if (isEAForum && new Date(currentUser.createdAt) > new Date(annualReviewStart.get())) return false
  return true
}