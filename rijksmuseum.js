const request = require('request');
const querystring = require('querystring');

const Rijksmuseum = class{
    constructor(config) {
        this.__config = config;
        this.__collectionUrl = `https://www.rijksmuseum.nl/api/${this.__config.culture}/collection?key=${this.__config.apikey}&format=json`;
        this.__collectionDetailUrl = `https://www.rijksmuseum.nl/api/${this.__config.culture}/collection/!!objectNumber!!?key=${this.__config.apikey}&format=json`;
    }

    getCollection(query, options, callback) {
        this.__currentCollectionPage = -1;
        this.__numberOfCollectionPages = 1;
        this.__collectionConfig = options;
        if(typeof(query) === 'string')
            this.__collectionConfig.query = query;
        if(this.__collectionConfig.pagesize == null)
            this.__collectionConfig.pagesize = 10;

        let _params = [];
        _params.push(`ps=${this.__collectionConfig.pagesize}`);
        _params.push(`q=${encodeURIComponent(this.__collectionConfig.query)}`);
        if(this.__collectionConfig.maker)
            _params.push(`principalMaker=${encodeURIComponent(this.__collectionConfig.maker)}`);
        if(this.__collectionConfig.involvedMaker)
            _params.push(`involvedMaker=${encodeURIComponent(this.__collectionConfig.involvedMaker)}`);
        if(this.__collectionConfig.place)
            _params.push(`place=${encodeURIComponent(this.__collectionConfig.place)}`);
        if(this.__collectionConfig.type)
            _params.push(`type=${encodeURIComponent(this.__collectionConfig.type)}`);
        if(this.__collectionConfig.material)
            _params.push(`material=${encodeURIComponent(this.__collectionConfig.material)}`);
        if(this.__collectionConfig.technique)
            _params.push(`technique=${this.encodeURIComponent(__collectionConfig.technique)}`);
        if(this.__collectionConfig.century)
        {   if(this.__collectionConfig.century > 0)
                if(this.__collectionConfig.century <= 21)
                    _params.push(`f.dating.period=${this.__collectionConfig.century}`);
                else if(this.__collectionConfig.century <= (new Date()).getFullYear())
                    _params.push(`f.dating.period=${Math.ceil(this.__collectionConfig.century / 100)}`);
            }
        if(this.__collectionConfig.imgonly)
            _params.push(`imgonly=${this.__collectionConfig.imgonly}`);
        if(this.__collectionConfig.toppieces)
            _params.push(`toppieces=${this.__collectionConfig.toppieces}`);
        if(this.__collectionConfig.sortby)
            _params.push(`s=${this.__collectionConfig.sortby}`);
        if(this.__collectionConfig.colors)
            for(let i = 0; i < this.__collectionConfig.colors.length; i++) {
                _params.push(`f.normalized32Colors.hex=${encodeURIComponent(this.__collectionConfig.colors[i])}`);
            }
        let _rqurl = this.__collectionUrl;
        for(let i = 0; i < _params.length; i++) {
            _rqurl += `&${_params[i]}`;
        }
        this.__activeCollectionUrl = _rqurl;
        console.log(_rqurl);
        request(_rqurl, (error, response, body) => {
            if(error) {
                callback(error, null);
            } else {
                let _c = JSON.parse(body);
                this.__currentCollectionPage = 1;
                this.__numberOfCollectionPages = Math.ceil(_c.count / this.__collectionConfig.pagesize);
                callback(null, _c);
            }
        });
    }

    getNextCollectionPage(callback) {
        this.__currentCollectionPage++;
        if(this.__currentCollectionPage > this.__numberOfCollectionPages)
            callback(null, {});
        else {
            console.log(`${this.__activeCollectionUrl}&p=${this.__currentCollectionPage}`);
            request(`${this.__activeCollectionUrl}&p=${this.__currentCollectionPage}`, (error, response, body) => {
                if(error) {
                    callback(error, null);
                } else {
                    let _c = JSON.parse(body);
                    callback(null, _c);
                }
            });
        }     
    }

    getCollectionDetailPage(objectNumber, callback) {
        let _detailUrl = this.__collectionDetailUrl.replace('!!objectNumber!!', objectNumber);
        console.log(_detailUrl);
        request(_detailUrl, (error, response, body) => {
            if(error) {
                callback(error, null);
            } else {
                let _c = JSON.parse(body);
                callback(null, _c);
            }
        });
    }
}

module.exports = Rijksmuseum;
