import { Chip, ChipProps, makeStyles, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { FC, useMemo } from 'react'

import { Categories, Recipe } from '@/model/model'

import { useCategoriesCollectionContext } from '../Provider/CategoriesCollectionProvider'
import getIconByCategory from './CategoryIcons'

type StyleProps = { swatches?: Recipe['previewAttachmentSwatches']; extraPadding?: boolean }

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  categoryResultRoot: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: props => (props.extraPadding ? `0px ${theme.spacing(1)}px` : undefined),
    flexWrap: 'nowrap',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  root: props => ({
    backgroundColor: props.swatches?.muted,
    color: props.swatches?.muted ? theme.palette.getContrastText(props.swatches.muted) : undefined,
  }),
  icon: {
    color: 'inherit',
  },
}))

interface CategoryResultProps extends Pick<ChipProps, 'color' | 'variant' | 'size'>, StyleProps {
  categories: Categories<string>
}

const MOCKS = new Array(4).fill(1)

export const CategoryResult: FC<CategoryResultProps> = ({
  categories,
  children,
  swatches,
  extraPadding,
  ...chipProps
}) => {
  const { categoryResultRoot, ...chipClasses } = useStyles({ swatches, extraPadding })
  const { recipeCategories, categoriesLoading } = useCategoriesCollectionContext()

  const sortedCategories = useMemo(() => {
    const types = Object.keys(recipeCategories)
    return Object.keys(categories).sort((a, b) => types.indexOf(a) - types.indexOf(b))
  }, [categories, recipeCategories])

  if (categoriesLoading) {
    return (
      <div className={categoryResultRoot}>
        {MOCKS.map((_, index) => (
          <Chip classes={chipClasses} size="small" key={index} label={<Skeleton width={90} />} />
        ))}
      </div>
    )
  }

  return (
    <div className={categoryResultRoot}>
      {sortedCategories.map(type => (
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
