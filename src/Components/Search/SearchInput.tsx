import {
    CircularProgress,
    createStyles,
    InputAdornment,
    InputBase,
    makeStyles,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React from 'react'

import { ReactComponent as AlgoliaIcon } from '../../icons/algolia.svg'

interface Props {
    searchValue: string
    loading: boolean
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        searchInput: {
            padding: theme.spacing(2),
        },
    })
)

const SearchInput = ({ searchValue, loading, onChange }: Props) => {
    const classes = useStyles()

    return (
        <InputBase
            className={classes.searchInput}
            autoFocus={searchValue.length === 0}
            fullWidth
            placeholder="Rezepte durchsuchen"
            value={searchValue}
            onChange={onChange}
            startAdornment={
                <InputAdornment position="start">
                    {loading ? <CircularProgress thickness={8} size={24} /> : <SearchIcon />}
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.algolia.com/docsearch">
                        <AlgoliaIcon />
                    </a>
                </InputAdornment>
            }
        />
    )
}

export default SearchInput
