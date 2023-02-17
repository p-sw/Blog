import Navigation from "@/components/navigation"

function DefaultLayout(
  {
      children,
      searchBarEnabled=false,
      onSearchBarOpen=()=>{},
      onSearchBarClose=()=>{},
      extraButtons=null
  }) {
    return <>
        <Navigation
          searchBarEnabled={searchBarEnabled}
          onSearchBarOpen={onSearchBarOpen}
          onSearchBarClose={onSearchBarClose}
          extraButtons={extraButtons}
        />
        {children}
    </>
}

export default DefaultLayout