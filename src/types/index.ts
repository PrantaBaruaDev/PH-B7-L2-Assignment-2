
export const USER_ROLE = ["contributor", "maintainer"] as const;
export const ISSUES_TYPE = ["bug", "feature_request"] as const;
export const ISSUES_STATUS = ["open", "in_progress", "resolved"] as const;
export const ISSUE_SORT = ["newest", "oldest"] as const;

export type ROLES = (typeof USER_ROLE)[number];
export type ISS_TYPE = (typeof ISSUES_TYPE)[number];
export type ISS_STATUS = (typeof ISSUES_STATUS)[number];
export type ISS_SORT = (typeof ISSUE_SORT)[number];
