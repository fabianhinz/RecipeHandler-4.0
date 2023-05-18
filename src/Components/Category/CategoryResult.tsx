import { Chip, ChipProps, makeStyles, Theme } from '@material-ui/core'
import { FC, useMemo } from 'react'

import { Categories, Recipe } from '@/model/model'
import { sortObjectKeys } from '@/util/fns'

import getIconByCategory from './CategoryIcons'

type StyleProps = {
  swatches?: Recipe['previewAttachmentSwatches']
  extraPadding?: boolean
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  categoryResultRoot: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: props =>
      props.extraPadding ? `0px ${theme.spacing(1)}px` : undefined,
    flexWrap: 'nowrap',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  root: props => ({
    backgroundColor: props.swatches?.muted,
    color: props.swatches?.muted
      ? theme.palette.getContrastText(props.swatches.muted)
      : undefined,
  }),
  icon: {
    color: 'inherit',
  },
}))

interface CategoryResultProps
  extends Pick<ChipProps, 'color' | 'variant' | 'size'>,
    StyleProps {
  categories: Categories<string>
}

export const CategoryResult: FC<CategoryResultProps> = ({
  categories,
  children,
  swatches,
  extraPadding,
  ...chipProps
}) => {
  const { categoryResultRoot, ...chipClasses } = useStyles({
    swatches,
    extraPadding,
  })

  const memoizedCategories = useMemo(
    () => sortObjectKeys('asc', categories),
    [categories]
  )

  return (
    <div className={categoryResultRoot}>
      {Object.keys(memoizedCategories).map(type => (
        <div key={type}>
          {categories[type].length > 0 && (
            <Chip
              classes={chipClasses}
              size="small"
              icon={getIconByCategory(categories[type])}
              label={categories[type]}
              {...chipProps}
            />
          )}
        </div>
      ))}
    </div>
  )
}
