import Navigation from "@/components/navigation"

function DefaultLayout({children, searchBarEnabled=false, onSearchBarOpen=()=>{}, onSearchBarClose=()=>{} }) {
    return <>
        <Navigation
          searchBarEnabled={searchBarEnabled}
          onSearchBarOpen={onSearchBarOpen}
          onSearchBarClose={onSearchBarClose}
        />
        {children}
    </>
}

export default DefaultLayout