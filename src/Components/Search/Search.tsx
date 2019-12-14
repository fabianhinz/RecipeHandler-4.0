import {
    Box,
    createStyles,
    Divider,
    Drawer,
    Fab,
    List,
    makeStyles,
    Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React, { useEffect, useState } from 'react'

import useDebounce from '../../hooks/useDebounce'
import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'
import { Hits } from '../../model/model'
import { index } from '../../services/algolia'
import SearchHit from './SearchHit'
import SearchInput from './SearchInput'

const useStyles = makeStyles(() =>
    createStyles({
        list: {
            maxHeight: '100%',
            overflowY: 'auto',
        },
        paper: {
            paddingTop: 'env(safe-area-inset-top)',
        },
    })
)

const Search = () => {
    const [searchDrawer, setSearchDrawer] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [algoliaHits, setAlgoliaHits] = useState<Hits>([])
    const [error, setError] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const classes = useStyles()
    const debouncedSearchValue = useDebounce(searchValue, 500)

    const handleSearchDrawerChange = () => setSearchDrawer(previous => !previous)

    useEffect(() => {
        if (debouncedSearchValue.length > 0) {
            index
                .search(debouncedSearchValue)
                .then(({ hits }) => {
                    setError(null)
                    setAlgoliaHits(hits)
                    setLoading(false)
                })
                .catch(error => {
                    setError(error)
                    setLoading(false)
                })
        } else {
            setAlgoliaHits([])
            setLoading(false)
        }
    }, [debouncedSearchValue])

    return (
        <>
            <Box marginBottom={2} display="flex" justifyContent="space-evenly">
                <Fab onClick={handleSearchDrawerChange} size="small" color="primary">
                    <SearchIcon />
                </Fab>
            </Box>

            <Drawer
                open={searchDrawer}
                PaperProps={{ className: classes.paper }}
                onClose={handleSearchDrawerChange}
                anchor="top">
                <Box padding={2}>
                    <SearchInput
                        searchValue={searchValue}
                        loading={loading}
                        onChange={e => {
                            setLoading(true)
                            setSearchValue(e.target.value)
                        }}
                    />
                </Box>

                <Divider />

                {algoliaHits.length > 0 && (
                    <List className={classes.list}>
                        {algoliaHits.map(recipeHit => (
                            <SearchHit
                                key={recipeHit.name}
                                recipeHit={recipeHit}
                                onHitSelect={handleSearchDrawerChange}
                                debouncedSearchValue={debouncedSearchValue}
                            />
                        ))}
                    </List>
                )}

                {!loading && algoliaHits.length === 0 && searchValue.length > 0 && (
                    <Box padding={2} display="flex" justifyContent="center">
                        <NotFoundIcon width={150} />
                    </Box>
                )}

                {!loading && error && (
                    <Typography gutterBottom align="center" variant="h6">
                        Fehler beim Abruf der Daten
                    </Typography>
                )}
            </Drawer>
        </>
    )
}

export default Search
