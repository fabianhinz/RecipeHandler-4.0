import { Box, createStyles, Divider, Drawer, Fab, List, makeStyles } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React, { useEffect, useState } from 'react'

import { index } from '../../../algolia'
import useDebounce from '../../../hooks/useDebounce'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { Hits } from '../../../model/model'
import { HomeSearchHit } from './HomeSearchHit'
import { HomeSearchInput } from './HomeSearchInput'

const useStyles = makeStyles(() =>
    createStyles({
        list: {
            maxHeight: '100%',
            overflowY: 'auto',
        },
    })
)

export const HomeSearch = () => {
    const [searchDrawer, setSearchDrawer] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [algoliaHits, setAlgoliaHits] = useState<Hits>([])
    const [loading, setLoading] = useState(false)

    const classes = useStyles()
    const debouncedSearchValue = useDebounce(searchValue, 500)

    const handleSearchDrawerChange = () => setSearchDrawer(previous => !previous)

    useEffect(() => {
        if (debouncedSearchValue.length > 0) {
            index.search(debouncedSearchValue).then(({ hits }) => {
                setAlgoliaHits(hits)
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

            <Drawer open={searchDrawer} onClose={handleSearchDrawerChange} anchor="top">
                <Box padding={2}>
                    <HomeSearchInput
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
                            <HomeSearchHit
                                key={recipeHit.name}
                                recipeHit={recipeHit}
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
            </Drawer>
        </>
    )
}
