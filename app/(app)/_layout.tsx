import { DrawerProvider } from "@/src/components/features/Drawer"
import NavTab from "@/src/components/features/TabHeaders"

export default function AppLayout() {
    return (
        <DrawerProvider>
            <NavTab />
        </DrawerProvider>
    )
}
