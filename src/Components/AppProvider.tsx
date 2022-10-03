import { FC } from 'react'

import AttachmentGalleryProvider from '@/Components/Provider/AttachmentGalleryProvider'
import BookmarkProvider from '@/Components/Provider/BookmarkProvider'
import CategoriesCollectionProvider from '@/Components/Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from '@/Components/Provider/DeviceOrientationProvider'
import GridProvider from '@/Components/Provider/GridProvider'
import RouterProvider from '@/Components/Provider/RouterProvider'
import SearchResultsProvider from '@/Components/Provider/SearchResultsProvider'
import SelectedAttachementProvider from '@/Components/Provider/SelectedAttachementProvider'
import UsersProvider from '@/Components/Provider/UsersProvider'

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
