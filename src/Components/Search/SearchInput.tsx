import {
    Button,
    CircularProgress,
    createStyles,
    IconButton,
    InputAdornment,
    InputBase,
    makeStyles,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React from 'react'

import { ReactComponent as AlgoliaIcon } from '../../icons/algolia.svg'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'

interface Props {
    searchValue: string
    loading: boolean
    onSearchBtnClick: () => void
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        searchInput: {
            padding: theme.spacing(2),
        },
        algoliaBrandBtn: {
            borderRadius: 0,
        },
    })
)

const algoliaBrand = (
    <a
        style={{ lineHeight: 0, width: '100%' }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.algolia.com/docsearch">
        <AlgoliaIcon />
    </a>
)

const SearchInput = ({ searchValue, loading, onChange, onSearchBtnClick }: Props) => {
    const classes = useStyles()
    const { isMobile } = useBreakpointsContext()

    return (
        <>
            {isMobile && (
                <Button classes={{ root: classes.algoliaBrandBtn }} variant="contained" fullWidth>
                    {algoliaBrand}
                </Button>
            )}
            <InputBase
                className={classes.searchInput}
                autoFocus={searchValue.length === 0}
                fullWidth
                placeholder="Rezepte durchsuchen"
                value={searchValue}
                onChange={onChange}
                startAdornment={
                    <InputAdornment position="start">
                        {loading ? (
                            <CircularProgress thickness={8} size={24} />
                        ) : (
                            <IconButton onClick={onSearchBtnClick}>
                                <SearchIcon />
                            </IconButton>
                        )}
                    </InputAdornment>
                }
                endAdornment={
                    !isMobile && <InputAdornment position="end">{algoliaBrand}</InputAdornment>
                }
            />
        </>
    )
}

export default SearchInput
