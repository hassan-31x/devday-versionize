import { create } from 'zustand'

type MobileSidebarProps = {
    isOpen: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

export const useMobileSidebar = create<MobileSidebarProps>((set) => ({
    isOpen: false,
    handleOpen: () => set({ isOpen: true }),
    handleClose: () => set({ isOpen: false })
}))