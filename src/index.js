
// import icon from './icon.png'

let memoize =require( "cerebro-tools").memoize;

const suggest = (term, display) => {
    let query=encodeURIComponent(term.split(" ").slice(1).join(" "));
    return fetch(`https://api.crumbit.org/api/suggest/v2/suggest?q=${query}&size_generic=3&size_places=3&size_themes=3`).then(response => {
        return response.json();
    })
};

const getSuggestions = memoize(suggest, {maxAge: 60 * 60 * 1000, preFetch: true});

const plugin = ({ term, actions, display }) => {
    var search = (searchTerm) => {
        const q = encodeURIComponent(searchTerm)
        actions.open('https://beta.crumbit.org/search/' + q )
        actions.hideWindow()
    };
    var theme = (searchTerm) => {
        const q = encodeURIComponent(searchTerm)
        actions.open('https://beta.crumbit.org/themes/' + q )
        actions.hideWindow()
    };
    var place = (searchTerm) => {
        const q = encodeURIComponent(searchTerm)
        actions.open('https://beta.crumbit.org/places/' + q )
        actions.hideWindow()
    };
    if(!term.toUpperCase().startsWith("CRUMB")) return;
    getSuggestions(term, display).then((data) => {


        data.generic.map(entry => {
            display({
                icon: "http://crumbit.org/images/crumbit-logo-pink.svg",
                title: entry,
                onSelect: () => search(entry)
            })
        });
        data.themes.map(entry => {
            display({
                icon: "http://crumbit.org/images/crumbit-logo-pink.svg",
                title: `Theme: ${entry.text}`,
                onSelect: () => theme(entry.id)
            })
        });
        data.places.map(entry => {
            display({
                icon: "http://crumbit.org/images/crumbit-logo-pink.svg",
                title: `Place: ${entry.text}`,
                onSelect: () => place(entry.id)
            })
        });
    });

};

module.exports = {
    fn: plugin
};