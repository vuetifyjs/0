import { describe, expect, it } from 'vitest'

import { BuBreadcrumb } from './BuBreadcrumb'
import { BuBreadcrumbItem } from './BuBreadcrumbItem'
import { BuDropdown } from './BuDropdown'
import { BuDropdownMenu } from './BuDropdownMenu'
import { BuDropdownTrigger } from './BuDropdownTrigger'
import { BuField } from './BuField'
import { BuFieldBody } from './BuFieldBody'
import { BuFieldLabel } from './BuFieldLabel'
import { BuFile } from './BuFile'
import { BuFileCta } from './BuFileCta'
import { BuFileIcon } from './BuFileIcon'
import { BuFileName } from './BuFileName'
import { BuMenu } from './BuMenu'
import { BuMenuItem } from './BuMenuItem'
import { BuMenuLabel } from './BuMenuLabel'
import { BuMenuLink } from './BuMenuLink'
import { BuMenuList } from './BuMenuList'
import { BuMessage } from './BuMessage'
import { BuMessageBody } from './BuMessageBody'
import { BuMessageDelete } from './BuMessageDelete'
import { BuMessageHeader } from './BuMessageHeader'
import { BuModal } from './BuModal'
import { BuModalBody } from './BuModalBody'
import { BuModalCard } from './BuModalCard'
import { BuModalClose } from './BuModalClose'
import { BuModalContent } from './BuModalContent'
import { BuModalDelete } from './BuModalDelete'
import { BuModalFoot } from './BuModalFoot'
import { BuModalHead } from './BuModalHead'
import { BuModalTitle } from './BuModalTitle'
import { BuNavbar } from './BuNavbar'
import { BuNavbarBrand } from './BuNavbarBrand'
import { BuNavbarMenu } from './BuNavbarMenu'
import { BuNotification } from './BuNotification'
import { BuNotificationDelete } from './BuNotificationDelete'
import { BuNumberField } from './BuNumberField'
import { BuNumberFieldDecrement } from './BuNumberFieldDecrement'
import { BuNumberFieldIncrement } from './BuNumberFieldIncrement'
import { BuNumberFieldInput } from './BuNumberFieldInput'
import { BuPagination } from './BuPagination'
import { BuPaginationEllipsis } from './BuPaginationEllipsis'
import { BuPaginationItem } from './BuPaginationItem'
import { BuPaginationList } from './BuPaginationList'
import { BuPaginationNext } from './BuPaginationNext'
import { BuPaginationPrev } from './BuPaginationPrev'
import { BuPanel } from './BuPanel'
import { BuPanelBlock } from './BuPanelBlock'
import { BuPanelHeading } from './BuPanelHeading'
import { BuPanelIcon } from './BuPanelIcon'
import { BuPanelTab } from './BuPanelTab'
import { BuPanelTabs } from './BuPanelTabs'
import { BuTab } from './BuTab'
import { BuTabList } from './BuTabList'
import { BuTabPanel } from './BuTabPanel'
import { BuTabs } from './BuTabs'

describe('compound parent exports', () => {
  it('attaches each part to the parent as the same component as the flat name', () => {
    expect(BuBreadcrumb.Item).toBe(BuBreadcrumbItem)

    expect(BuDropdown.Trigger).toBe(BuDropdownTrigger)
    expect(BuDropdown.Menu).toBe(BuDropdownMenu)

    expect(BuField.Label).toBe(BuFieldLabel)
    expect(BuField.Body).toBe(BuFieldBody)

    expect(BuFile.Cta).toBe(BuFileCta)
    expect(BuFile.Icon).toBe(BuFileIcon)
    expect(BuFile.Name).toBe(BuFileName)

    expect(BuMenu.Label).toBe(BuMenuLabel)
    expect(BuMenu.List).toBe(BuMenuList)
    expect(BuMenu.Item).toBe(BuMenuItem)
    expect(BuMenu.Link).toBe(BuMenuLink)

    expect(BuMessage.Header).toBe(BuMessageHeader)
    expect(BuMessage.Delete).toBe(BuMessageDelete)
    expect(BuMessage.Body).toBe(BuMessageBody)

    expect(BuModal.Content).toBe(BuModalContent)
    expect(BuModal.Close).toBe(BuModalClose)
    expect(BuModal.Card).toBe(BuModalCard)
    expect(BuModal.Head).toBe(BuModalHead)
    expect(BuModal.Title).toBe(BuModalTitle)
    expect(BuModal.Delete).toBe(BuModalDelete)
    expect(BuModal.Body).toBe(BuModalBody)
    expect(BuModal.Foot).toBe(BuModalFoot)

    expect(BuNavbar.Brand).toBe(BuNavbarBrand)
    expect(BuNavbar.Menu).toBe(BuNavbarMenu)

    expect(BuNotification.Delete).toBe(BuNotificationDelete)

    expect(BuNumberField.Decrement).toBe(BuNumberFieldDecrement)
    expect(BuNumberField.Input).toBe(BuNumberFieldInput)
    expect(BuNumberField.Increment).toBe(BuNumberFieldIncrement)

    expect(BuPagination.Prev).toBe(BuPaginationPrev)
    expect(BuPagination.Next).toBe(BuPaginationNext)
    expect(BuPagination.List).toBe(BuPaginationList)
    expect(BuPagination.Item).toBe(BuPaginationItem)
    expect(BuPagination.Ellipsis).toBe(BuPaginationEllipsis)

    expect(BuPanel.Heading).toBe(BuPanelHeading)
    expect(BuPanel.Tabs).toBe(BuPanelTabs)
    expect(BuPanel.Tab).toBe(BuPanelTab)
    expect(BuPanel.Block).toBe(BuPanelBlock)
    expect(BuPanel.Icon).toBe(BuPanelIcon)

    expect(BuTabs.List).toBe(BuTabList)
    expect(BuTabs.Tab).toBe(BuTab)
    expect(BuTabs.Panel).toBe(BuTabPanel)
  })
})
