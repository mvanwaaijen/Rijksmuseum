# Rijksmuseum

This is a wrapper around the public API of the Rijksmuseum in Amsterdam, The Netherlands

### Prerequisites

Before you can use this wrapper or the API, you need a api-key. You can read more on how to obtain
the API key and the parameters you can use from this page: http://rijksmuseum.github.io/

## Getting Started

You can install the wrapper with "npm install rijksmuseum".

Currently only the "Collection" and "Collection Details" requests are implemented.

During the creation of the Rijksmuseum class you need to provide the apikey and culture. Only cultures "en" (English) and "nl" (Nederlands) are supported. Default is "nl":

```
    const Rijksmuseum = require('rijksmuseum');
    const museum = new Rijksmuseum({apikey: 'xxxxxxxx', culture: 'nl | en'});
```

To get a selection of the collection (all filter options are explained below):

```
    let collectionFilter = {involvedMaker: 'Rembrandt Harmensz. van Rijn'};

    museum.getCollection('De Nachtwacht', collectionFilter, (err, result) => {
        if(err)
            console.log(err);
        else
            console.log(JSON.stringify(result));
    });
```

And to iterate through the following pages in the selection:

```
    museum.getNextCollectionPage((err, result) => {
        if(err)
            console.log(err);
        else
            console.log(JSON.stringify(result));
    });
```
After the last page an empty object ({}) is returned. 

And to get the details page of an object, you use the objectNumber as the first parameter:

```
    museum.getCollectionDetailPage('SK-A-4691', (err, result) => {
        if(err)
            console.log('error %s', err);
        else
            console.log(JSON.stringify(result));
    });
```

### Filter options (all optional):
```
{
    pagesize: 10,         // (values 1-100, default = 10)
    query: 'Nachtwacht',  // you can specify the query here or as the first parameter of the function call
    maker: 'Rembrandt Harmensz. van Rijn', // name of the artist
    involvedMaker: 'Rembrandt Harmensz. van Rijn', // name of an involved artist, e.g. work is based on this person's work
    place: 'Amsterdam',   // location where the object was worked on
    type: 'schilderij',   // type of object, like schilderij (or painting), foto (photo), etc
    material: 'canvas',   // material used for the object
    technique: 'chromolithografie', // technique used
    century: 17,          // century of the works (values between 0 - 21), or a full year. year will be converted to a century value
    imgonly: false,       // only return results where images are available (default is false) 
    toppieces: false,     // only return top-pieces (default is false)
    sortby: 'relevance',  // sorting fields. see http://rijksmuseum.github.io/ for options
    colors: ['#FFFFFF']   // array of color codes used in the object
}
```


## Authors

* **Marcel van Waaijen** - *Initial work* - [mvanwaaijen](https://github.com/mvanwaaijen)

## License

This project is licensed under the ISC License

## Acknowledgments

* Thanks to jkaizer and remcoder who created the initial api on https://github.com/Rijksmuseum
