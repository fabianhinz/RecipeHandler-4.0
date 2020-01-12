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
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import SearchHit from './SearchHit'
import SearchInput from './SearchInput'

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            paddingTop: 'env(safe-area-inset-top)',
            maxHeight: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
        },
        safeAreaIos: {
            height: 'env(safe-area-inset-top)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.drawer + 1,
            background: theme.palette.background.paper,
        },
        searchContainer: {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
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
    const { user } = useFirebaseAuthContext()

    const handleSearchDrawerChange = () => setSearchDrawer(previous => !previous)

    useEffect(() => {
        if (debouncedSearchValue.length > 0) {
            index
                .search({
                    query: debouncedSearchValue,
                    advancedSyntax: user && user.algoliaAdvancedSyntax ? true : false,
                })
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
    }, [debouncedSearchValue, user])

    return (
        <>
            <Box marginBottom={2} display="flex" justifyContent="center">
                <Fab onClick={handleSearchDrawerChange} size="small" color="primary">
                    <SearchIcon />
                </Fab>
            </Box>

            <Drawer
                open={searchDrawer}
                PaperProps={{ className: classes.paper }}
                onClose={handleSearchDrawerChange}
                anchor="top">
                <div className={classes.safeAreaIos} />
                <div className={classes.searchContainer}>
                    <SearchInput
                        onSearchBtnClick={() => setSearchDrawer(false)}
                        searchValue={searchValue}
                        loading={loading}
                        onChange={e => {
                            setLoading(true)
                            setSearchValue(e.target.value)
                        }}
                    />

                    <Divider />
                </div>

                {algoliaHits.length > 0 && (
                    <List>
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
