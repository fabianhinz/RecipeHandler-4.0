import { FC } from 'react'

import AttachmentGalleryProvider from '@/Provider/AttachmentGalleryProvider'
import BookmarkProvider from '@/Provider/BookmarkProvider'
import CategoriesCollectionProvider from '@/Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from '@/Provider/DeviceOrientationProvider'
import GridProvider from '@/Provider/GridProvider'
import RouterProvider from '@/Provider/RouterProvider'
import SearchResultsProvider from '@/Provider/SearchResultsProvider'
import SelectedAttachementProvider from '@/Provider/SelectedAttachementProvider'
import UsersProvider from '@/Provider/UsersProvider'

export const AppProvider: FC = ({ children }) => (
    <RouterProvider>
        <DeviceOrientationProvider>
            <UsersProvider>
                <CategoriesCollectionProvider>
                    <GridProvider>
                        <SelectedAttachementProvider>
                            <AttachmentGalleryProvider>
                                <BookmarkProvider>
                                    <SearchResultsProvider>{children}</SearchResultsProvider>
                                </BookmarkProvider>
                            </AttachmentGalleryProvider>
                        </SelectedAttachementProvider>
                    </GridProvider>
                </CategoriesCollectionProvider>
            </UsersProvider>
        </DeviceOrientationProvider>
    </RouterProvider>
)
