import NavTab from "@/src/components/(app)/Nav"
import { DrawerProvider } from "@/src/components/Drawer"

export default function AppLayout() {
    return (
        <DrawerProvider>
            <NavTab />
        </DrawerProvider>
    )
}
