import Navigation from "@/components/navigation"

function DefaultLayout({children}) {
    return <>
        <Navigation />
        {children}
        <style jsx global>{`
          div#__next {
            padding-top: 7vh;
          }
        `}</style>
    </>
}

export default DefaultLayout