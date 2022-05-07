import { User } from '../../../model/model'

export type AccountSettingKeys = keyof Pick<
  User,
  | 'muiTheme'
  | 'selectedUsers'
  | 'showRecentlyEdited'
  | 'showMostCooked'
  | 'showNew'
  | 'notifications'
  | 'algoliaAdvancedSyntax'
  | 'bookmarkSync'
>

export type AccountSettingChangeHandler = (key: AccountSettingKeys) => (uid?: any) => void
