import Navigation from "@/components/navigation"

function DefaultLayout({children}) {
    return <>
        <Navigation />
        {children}
    </>
}

export default DefaultLayout